package com.invoice.backend.service;

import com.invoice.backend.dto.VendorStatsDTO;
import com.invoice.backend.entity.Invoice;
import com.invoice.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private static final UUID UPLOADER_COMPANY_ID =
            UUID.fromString("a919b2cb-5110-45aa-931b-6b896e9f7f5a");
    private static final UUID RECEIVER_COMPANY_ID =
            UUID.fromString("19556fc8-855c-46a2-9764-8ebb7721d8c5");

    public Invoice uploadAndExtract(MultipartFile file) {

        Map<String, Object> extractedData = callAiService(file);

        // ── Step 2: Parse response ──
        String invoiceNumber = (String) extractedData.get("invoice_number");
        String vendorName    = (String) extractedData.get("vendor_name");
        String dateStr       = (String) extractedData.get("invoice_date");
        Number grandTotalNum = (Number) extractedData.get("grand_total");

        LocalDate invoiceDate = parseFlexibleDate(dateStr);
        BigDecimal grandTotal = BigDecimal.valueOf(grandTotalNum.doubleValue());

        Invoice invoice = Invoice.builder()
                .uploaderCompanyId(UPLOADER_COMPANY_ID)
                .receiverCompanyId(RECEIVER_COMPANY_ID)
                .invoiceNumber(invoiceNumber)
                .vendorName(vendorName)
                .invoiceDate(invoiceDate)
                .grandTotal(grandTotal)
                .build();

        Invoice saved = invoiceRepository.save(invoice);

        ingestIntoChatbot(file);

        return saved;
    }

    private LocalDate parseFlexibleDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            System.err.println("Date string is null or blank — using today's date");
            return LocalDate.now();
        }

        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("d MMMM yyyy",  Locale.ENGLISH),
                DateTimeFormatter.ofPattern("dd MMM yyyy",  Locale.ENGLISH),
                DateTimeFormatter.ofPattern("d MMM yyyy",   Locale.ENGLISH),
                DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("MM/dd/yyyy"),
                DateTimeFormatter.ofPattern("dd-MM-yyyy")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateStr.trim(), formatter);
            } catch (DateTimeParseException ignored) {}
        }

        System.err.println("Could not parse date: '" + dateStr + "' — using today's date");
        return LocalDate.now();
    }

    private void ingestIntoChatbot(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    aiServiceUrl + "/ingest",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            System.out.println("Chatbot ingestion result: " + response.getBody());

        } catch (Exception e) {
            System.err.println("Chatbot ingestion failed (non-fatal): " + e.getMessage());
        }
    }

    private Map<String, Object> callAiService(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    aiServiceUrl + "/extract",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> result = response.getBody();

            if (result == null) {
                throw new RuntimeException("AI service returned empty response");
            }

            System.out.println("AI extraction result: " + result);
            return result;

        } catch (Exception e) {
            System.err.println("AI service call failed: " + e.getMessage());
            throw new RuntimeException("Failed to extract invoice data from AI service: "
                    + e.getMessage());
        }
    }

    public VendorStatsDTO getVendorStats(UUID companyId) {
        Object[] result = invoiceRepository.getVendorStats(companyId).get(0);

        long totalInvoices    = ((Number) result[0]).longValue();
        long pendingInvoices  = ((Number) result[1]).longValue();
        long acceptedInvoices = ((Number) result[2]).longValue();
        long paidInvoices     = ((Number) result[3]).longValue();
        BigDecimal totalValue = (BigDecimal) result[4];

        return new VendorStatsDTO(
                totalInvoices,
                pendingInvoices,
                acceptedInvoices,
                paidInvoices,
                totalValue
        );
    }
}