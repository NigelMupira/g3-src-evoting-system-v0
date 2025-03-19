import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageElections from "./pages/admin/ManageElections";
import ManageCandidates from "./pages/admin/ManageCandidates";
import ViewResults from "./pages/admin/ViewResults";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Voter Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-elections" element={<ManageElections />} />
        <Route path="/admin/manage-candidates" element={<ManageCandidates />} />
        <Route path="/admin/view-results" element={<ViewResults />} />
      </Routes>
    </Router>
  );
};

export default App;
