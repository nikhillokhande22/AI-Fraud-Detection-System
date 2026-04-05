import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FraudChart from "./FraudChart";
import Transactions from "./Transactions";
import Users from "./Users";
import { getDashboard, getRiskGraph, getTransactions, getUsers } from "../services/api";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "stats", label: "Stats" },
  { id: "risk", label: "Risk Graph" },
  { id: "transactions", label: "Transactions" },
  { id: "users", label: "Users" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalTransactions: 0,
    fraudTransactions: 0,
    safeTransactions: 0,
    totalUsers: 0
  });
  const [risk, setRisk] = useState({
    low: 0,
    medium: 0,
    high: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalRisk = useMemo(() => risk.low + risk.medium + risk.high, [risk]);
  const highRiskPercent = totalRisk > 0 ? Math.round((risk.high / totalRisk) * 100) : 0;

  const averageAiScore = useMemo(() => {
    if (!transactions.length) return 0;
    const totalAi = transactions.reduce(
      (sum, transaction) => sum + (transaction.aiRiskScore || 0),
      0
    );
    return Math.round(totalAi / transactions.length);
  }, [transactions]);

  const blockedUsersCount = useMemo(() => {
    return users.filter((user) => user.blocked).length;
  }, [users]);

  const fraudRate = useMemo(() => {
    if (!dashboard.totalTransactions) return 0;
    return Math.round((dashboard.fraudTransactions / dashboard.totalTransactions) * 100);
  }, [dashboard]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardRes, riskRes, transactionsRes, usersRes] = await Promise.all([
        getDashboard(),
        getRiskGraph(),
        getTransactions(),
        getUsers()
      ]);

      setDashboard(dashboardRes.data);
      setRisk(riskRes.data);
      setTransactions(transactionsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.status === 403
          ? "Access denied. Please login with an admin account."
          : err?.response?.status === 401
          ? "Your session expired. Please login again."
          : "Failed to load dashboard")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((section) => {
        const el = document.getElementById(section.id);
        if (!el) return { id: section.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: section.id, top: Math.abs(rect.top - 120) };
      });

      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) {
        setActiveSection(offsets[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
          <div className="brand-box">
            <div className="brand-icon">AI</div>
            <div>
              <h4 className="mb-0">Fraud Shield</h4>
              <small>Admin Console</small>
            </div>
          </div>

          <nav className="sidebar-nav mt-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`nav-link ${activeSection === section.id ? "active" : ""}`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <p className="mb-2 fw-semibold">System Status</p>
          <small className="d-block mb-3">Connected to Spring Boot API</small>
          <button className="btn btn-light btn-sm w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <section id="overview" className="dashboard-hero card border-0 shadow-sm mb-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                <div>
                  <p className="dashboard-badge mb-2">Fraud Monitoring Center</p>
                  <h1 className="dashboard-title mb-2">AI Fraud Detection Dashboard</h1>
                  <p className="dashboard-subtitle mb-0">
                    Monitor suspicious activity, analyze risk levels, and manage users from one place.
                  </p>
                </div>

                <button className="btn btn-dark px-4 py-2" onClick={loadDashboard}>
                  Refresh Dashboard
                </button>
              </div>

              {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
            </div>
          </section>

          {loading ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-0">Loading dashboard...</h5>
              </div>
            </div>
          ) : (
            <>
              <section id="stats" className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Total Transactions</p>
                      <h2 className="stat-value">{dashboard.totalTransactions}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Fraud Transactions</p>
                      <h2 className="stat-value text-danger">{dashboard.fraudTransactions}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Blocked Users</p>
                      <h2 className="stat-value text-warning">{blockedUsersCount}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Fraud Rate</p>
                      <h2 className="stat-value text-danger">{fraudRate}%</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Safe Transactions</p>
                      <h2 className="stat-value text-success">{dashboard.safeTransactions}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">High Risk Score</p>
                      <h2 className="stat-value text-warning">{highRiskPercent}%</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Avg AI Score</p>
                      <h2 className="stat-value text-primary">{averageAiScore}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="card border-0 shadow-sm stat-card h-100">
                    <div className="card-body">
                      <p className="stat-label">Detection Source</p>
                      <h2 className="stat-value detection-text">AI + Rules</h2>
                    </div>
                  </div>
                </div>
              </section>

              <section id="risk" className="row g-4 mb-4">
                <div className="col-12 col-xl-7">
                  <FraudChart risk={risk} transactions={transactions} />
                </div>

                <div id="transactions" className="col-12 col-xl-5">
                  <Transactions />
                </div>
              </section>

              <section id="users" className="row">
                <div className="col-12">
                  <Users onActionComplete={loadDashboard} />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
