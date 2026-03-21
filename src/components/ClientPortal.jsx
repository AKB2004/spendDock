import React, { useState, useEffect } from "react";
import {
  fetchClientInvoices,
  clientReviewInvoice,
  markInvoicePaid
} from "../services/api";

export default function ClientPortal() {
  const role = localStorage.getItem("role");
  const [isDark, setIsDark] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await fetchClientInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleReview = async (invoiceId, status) => {
    try {
      setReviewLoading(invoiceId + status);
      await clientReviewInvoice(invoiceId, status);
      await fetchInvoices();
    } catch (err) {
      console.error("Review error:", err);
      alert("Review failed");
    } finally {
      setReviewLoading(null);
    }
  };

  const handleMarkPaid = (invoiceId) => {
    setPaymentStep(0);
    setShowGatewayModal(true);
    setTimeout(() => { setPaymentStep(1); }, 1000);
    setTimeout(async () => {
      try {
        await markInvoicePaid(invoiceId);
        setPaymentStep(2);
        await fetchInvoices();
      } catch (err) {
        console.error("Payment error:", err);
        alert("Payment failed");
        setShowGatewayModal(false);
      }
    }, 2000);
    setTimeout(() => {
      setShowGatewayModal(false);
      setPaymentStep(0);
    }, 3500);
  };

  const stepLabels = [
    { icon: "🔗", text: "Connecting to Payment Gateway..." },
    { icon: "⚙️", text: "Processing Payment Securely..." },
    { icon: "✅", text: "Payment Successful!" },
  ];
  
  const pendingCount = invoices.filter(i => i.clientStatus === "PENDING").length;
  const approvedCount = invoices.filter(i => i.clientStatus === "ACCEPTED").length;
  const paidCount = invoices.filter(i => i.paymentStatus === "PAID").length;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Payment Gateway Modal */}
      {showGatewayModal && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "#ffffff", borderRadius: "20px",
            padding: "40px 36px", width: "380px", textAlign: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #1a56db, #0e9f6e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏦</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "700", fontSize: "15px", color: "#111827" }}>RazorPay Gateway</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>Secure Payment Processing</div>
              </div>
            </div>
            <div style={{ height: "1px", background: "#f3f4f6", marginBottom: "24px" }} />
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{stepLabels[paymentStep].icon}</div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{stepLabels[paymentStep].text}</h2>
            {paymentStep < 2 ? (
              <>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "24px" }}>Please do not close this window</p>
                <div style={{ width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #1a56db", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
                <div style={{ height: "4px", backgroundColor: "#f3f4f6", borderRadius: "99px", overflow: "hidden", marginBottom: "20px" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #1a56db, #0e9f6e)", borderRadius: "99px", animation: "progressBar 2s linear forwards" }} />
                </div>
              </>
            ) : (
              <p style={{ fontSize: "13px", color: "#059669", fontWeight: "600", marginBottom: "20px" }}>₹ Amount has been debited successfully</p>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
              {[0, 1, 2].map((step) => (
                <div key={step} style={{ width: step === paymentStep ? "20px" : "8px", height: "8px", borderRadius: "99px", backgroundColor: step <= paymentStep ? "#1a56db" : "#e5e7eb", transition: "all 0.3s ease" }} />
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>🔒 256-bit SSL Encrypted · PCI DSS Compliant</p>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className={`font-bold text-xl ${isDark ? "text-black" : "text-white"}`}>S</span>
            </div>
            <div>
              <span className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>SpendDock</span>
              <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>Client Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl backdrop-blur-xl transition border ${isDark ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-black/10 hover:bg-black/20 border-black/20"}`}
            >
              <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
            </button>

            <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl backdrop-blur-xl border ${isDark ? "bg-white/10 border-white/20" : "bg-black/10 border-black/20"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? "bg-white/20" : "bg-black/20"}`}>
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>Company A</p>
                <p className={`text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>
                  {role === "client_manager" ? "Client Manager" : "Client Accountant"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-8 pb-8">

        {/* Page title */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>
            {role === "client_manager" ? "Invoice Review" : "Payment Center"}
          </h1>
          <p className={`text-lg ${isDark ? "text-white/60" : "text-black/60"}`}>
            {role === "client_manager"
              ? "Review and approve incoming invoices"
              : "Process payments for approved invoices"}
          </p>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending Review", value: pendingCount, icon: "⏳", color: "text-yellow-400" },
            { label: "Approved", value: approvedCount, icon: "✅", color: "text-green-400" },
            { label: "Paid", value: paidCount, icon: "💰", color: "text-blue-400" },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${isDark ? "text-white/50" : "text-black/50"} mb-1`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice list */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
              <div className="text-5xl mb-4">📭</div>
              <p className={`text-xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>No invoices yet</p>
              <p className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Invoices approved by the vendor manager will appear here</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>

                {/* Invoice card top */}
                <div className="p-6">
                  <div className="flex justify-between items-start">

                    {/* Left — invoice info */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDark ? "bg-white/10" : "bg-black/10"}`}>
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"} mb-1`}>{invoice.invoiceNumber}</h2>
                        <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                          {invoice.vendorName} · {invoice.invoiceDate}
                        </p>
                      </div>
                    </div>

                    {/* Right — amount and badges */}
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"} mb-2`}>
                        ₹ {Number(invoice.grandTotal).toLocaleString()}
                      </p>
                      <div className="flex gap-2 justify-end">
                    {invoice.paymentStatus === "PAID" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  ✅ Paid
                            </span>
                              ) : invoice.clientStatus === "REJECTED" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                ❌ Rejected
                             </span>
                            ) : invoice.clientStatus === "ACCEPTED" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            ✓ Approved — Awaiting Payment
                            </span>
                            ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              ⏳ Pending Review
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice card bottom — action area */}
                {(invoice.clientStatus === "PENDING" && invoice.paymentStatus !== "PAID" && role === "client_manager") ||
                 (invoice.clientStatus === "ACCEPTED" && invoice.paymentStatus === "PENDING" && role === "client_accountant") ||
                 invoice.clientStatus === "REJECTED" ||
                 invoice.paymentStatus === "PAID" ? (
                  <div className={`px-6 py-4 border-t ${isDark ? "border-white/10 bg-white/3" : "border-black/10 bg-black/3"}`}>

                    {/* Client manager — Approve/Reject */}
                    {invoice.clientStatus === "PENDING" &&
                     invoice.paymentStatus !== "PAID" &&
                     role === "client_manager" && (
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isDark ? "text-white/50" : "text-black/50"} mr-2`}>Action required:</span>
                        <button
                          onClick={() => handleReview(invoice.id, "ACCEPTED")}
                          disabled={reviewLoading === invoice.id + "ACCEPTED"}
                          className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reviewLoading === invoice.id + "ACCEPTED" ? "Approving..." : "✓ Approve"}
                        </button>
                        <button
                          onClick={() => handleReview(invoice.id, "REJECTED")}
                          disabled={reviewLoading === invoice.id + "REJECTED"}
                          className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reviewLoading === invoice.id + "REJECTED" ? "Rejecting..." : "✗ Reject"}
                        </button>
                      </div>
                    )}

                    {/* Client accountant — Pay Now */}
                    {invoice.clientStatus === "ACCEPTED" &&
                     invoice.paymentStatus === "PENDING" &&
                     role === "client_accountant" && (
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isDark ? "text-white/50" : "text-black/50"} mr-2`}>Ready for payment:</span>
                        <button
                          onClick={() => handleMarkPaid(invoice.id)}
                          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                          💳 Pay Now
                        </button>
                      </div>
                    )}

                    {/* Rejected */}
                    {invoice.clientStatus === "REJECTED" && (
                      <div className="flex items-center gap-2 text-red-400 font-medium">
                        <span>❌</span>
                        <span>Invoice rejected by client manager</span>
                      </div>
                    )}

                    {/* Paid */}
                    {invoice.paymentStatus === "PAID" && (
                      <div className="flex items-center gap-2 text-green-400 font-medium">
                        <span>✅</span>
                        <span>Payment completed successfully</span>
                      </div>
                    )}

                  </div>
                ) : null}

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}