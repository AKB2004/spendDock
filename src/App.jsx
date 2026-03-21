import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import SetPassword from "./components/SetPassword"
import Home from './components/Home'
import Auth from './components/Auth'
import VendorPortal from './components/VendorPortal'
import ClientPortal from './components/ClientPortal'

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/set-password" element={<SetPassword />} />

        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={["manager", "accountant"]}>
            <VendorPortal />
          </ProtectedRoute>
        } />

        <Route path="/client" element={
          <ProtectedRoute allowedRoles={["client_manager", "client_accountant"]}>
            <ClientPortal />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App