import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";

// Public
import HomePage from "../pages/HomePage";
import NeetugPage from "../pages/NeetugPage";
import NeetpgPage from "../pages/NeetpgPage";
import InicetPage from "../pages/InicetPage";
import NeetssPage from "../pages/NeetssPage";
import BlogHome from "../pages/blog/BlogHome";
import BlogPage from "../pages/blog/BlogPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import ContactUsPage from "../pages/ContactUsPage";
import PrivacyPolicy from "../pages/policies/PrivacyPolicy";
import TermsConditions from "../pages/policies/TermsConditions";
import NotFound from "../pages/NotFound";

// Protected
import NeetpgDashboard from "../pages/dashboard/NeetpgDashboard";
import NeetugDashboard from "../pages/dashboard/NeetugDashboard";
import InicetDashboard from "../pages/dashboard/InicetDashboard";

// INICET Data Pages
import InicetClosingRanks2025Page from "../pages/inicetDataPages/inicet2025/InicetClosingRanks2025Page";
import InicetClosingRanks2026Page from "../pages/inicetDataPages/inicet2026/InicetClosingRanks2026Page";
import InicetAllotmentsJuly2026Page from "../pages/inicetDataPages/inicet2026/InicetAllotmentsJuly2026Page";
import InicetAllotmentsJan2026Page from "../pages/inicetDataPages/inicet2026/InicetAllotmentsJan2026Page";
import InicetAllotmentsJuly2025Page from "../pages/inicetDataPages/inicet2025/InicetAllotmentsJuly2025Page";
import InicetAllotmentsJan2025Page from "../pages/inicetDataPages/inicet2025/InicetAllotmentsJan2025Page";

// NEET PG Data Pages
import PgFeesStipendBond2024Page from "../pages/neetpgDataPages/neetpg2024/PgFeesStipendBond2024Page";
import PgFeesStipendBond2025Page from "../pages/neetpgDataPages/neetpg2025/PgFeesStipendBond2025Page";
import PgSeatMatrix2025Page from "../pages/neetpgDataPages/neetpg2025/PgSeatMatrix2025Page";

// NEET UG Data Pages
import UgFeesStipendBond2025Page from "../pages/neetugDataPages/neetug2025/UgFeesStipendBond2025Page";
import UgSeatMatrix2025Page from "../pages/neetugDataPages/neetug2025/UgSeatMatrix2025Page";
import UgClosingRanks2025Page from "../pages/neetugDataPages/neetug2025/UgClosingRanks2025Page";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/neet-ug" element={<NeetugPage />} />
        <Route path="/neet-pg" element={<NeetpgPage />} />
        <Route path="/inicet" element={<InicetPage />} />
        <Route path="/neet-ss" element={<NeetssPage />} />
        <Route path="/blogs" element={<BlogHome />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= Public Route ================= */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ================= Protected Route ================= */}
      {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
       <Route path="neet-pg" element={<NeetpgDashboard />} />
        <Route path="neet-ug" element={<NeetugDashboard />} />
        <Route path="inicet" element={<InicetDashboard />} />
      </Route> */}

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="neet-pg" element={<NeetpgDashboard />} />
        <Route path="neet-ug" element={<NeetugDashboard />} />
        <Route path="inicet" element={<InicetDashboard />} />
      </Route>

      {/* ================= Protected Data Route ================= */}
      {/* INICET */}
      <Route
        path="/dashboard/inicet-closing-ranks-2025"
        element={<InicetClosingRanks2025Page />}
      />
      <Route
        path="/dashboard/inicet-closing-ranks-2026"
        element={<InicetClosingRanks2026Page />}
      />
      <Route
        path="/dashboard/inicet-allotments-july-2026"
        element={<InicetAllotmentsJuly2026Page />}
      />
      <Route
        path="/dashboard/inicet-allotments-jan-2026"
        element={<InicetAllotmentsJan2026Page />}
      />
      <Route
        path="/dashboard/inicet-allotments-july-2025"
        element={<InicetAllotmentsJuly2025Page />}
      />
      <Route
        path="/dashboard/inicet-allotments-jan-2025"
        element={<InicetAllotmentsJan2025Page />}
      />

      {/* NEET PG */}
      <Route
        path="/dashboard/neetpg-fee-stipend-bond-2024"
        element={<PgFeesStipendBond2024Page />}
      />
      <Route
        path="/dashboard/neetpg-fee-stipend-bond-2025"
        element={<PgFeesStipendBond2025Page />}
      />
      <Route
        path="/dashboard/neetpg-seat-matrix-2025"
        element={<PgSeatMatrix2025Page />}
      />

      {/* NEET UG */}
      <Route
        path="/dashboard/neetug-fee-stipend-bond-2025"
        element={<UgFeesStipendBond2025Page />}
      />
      <Route
        path="/dashboard/neetug-seat-matrix-2025"
        element={<UgSeatMatrix2025Page />}
      />
      <Route
        path="/dashboard/neetug-closing-ranks-2025"
        element={<UgClosingRanks2025Page />}
      />
      {/* <Route
        path="/dashboard/neetug-allotments-2025"
        element={<UgFeesStipendBond2025Page />}
      /> */}
    </Routes>
  );
}

export default AppRoutes;
