import React, { useEffect, useState } from "react";
import { getTransactions, getFraudTransactions } from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [fraudTransactions, setFraudTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const [allRes, fraudRes] = await Promise.all([
        getTransactions(),
        getFraudTransactions()
      ]);

      setTransactions(allRes.data);
      setFraudTransactions(fraudRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const exportTransactions = () => {
    if (!transactions.length) return;

    const headers = [
      "ID",
      "User",
      "Amount",
      "Location",
      "Type",
      "Device",
      "Risk Score",
      "AI Score",
      "Source",
      "Fraud",
      "Timestamp"
    ];

    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.user?.name || transaction.user?.id || "-",
      transaction.amount,
      transaction.location,
      transaction.type,
      transaction.device,
      transaction.riskScore,
      transaction.aiRiskScore,
      "AI + Rules",
      transaction.fraud ? "Yes" : "No",
      transaction.timestamp
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "transactions-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const recentTransactions = [...transactions].reverse().slice(0, 6);
  const recentFraud = [...fraudTransactions].reverse().slice(0, 3);

  return (
    <div className="card border-0 shadow-sm panel-card h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h4 className="mb-1">Recent Transactions</h4>
            <p className="text-muted mb-0">
              Latest activity from your fraud detection system.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-dark btn-sm" onClick={loadTransactions}>
              Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={exportTransactions}>
              Export CSV
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="mini-stat">
              <span>All Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>

          <div className="col-6">
            <div className="mini-stat">
              <span>Fraud Alerts</span>
              <strong className="text-danger">{fraudTransactions.length}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mb-0">Loading transactions...</p>
        ) : recentTransactions.length === 0 ? (
          <p className="mb-0 text-muted">No transactions found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th>AI Score</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.user?.name || transaction.user?.id || "-"}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.riskScore}</td>
                    <td>{transaction.aiRiskScore}</td>
                    <td>AI + Rules</td>
                    <td>
                      {transaction.fraud ? (
                        <span className="badge text-bg-danger">Fraud</span>
                      ) : (
                        <span className="badge text-bg-success">Safe</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && recentFraud.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold mb-3">Latest Fraud Alerts</h6>
            <div className="d-flex flex-column gap-2">
              {recentFraud.map((transaction) => (
                <div key={transaction.id} className="fraud-alert-card">
                  <div>
                    <div className="fw-semibold">
                      User: {transaction.user?.name || transaction.user?.id || "-"}
                    </div>
                    <div className="small text-muted">
                      {transaction.location} • {transaction.device}
                    </div>
                    <div className="small mt-1">
                      AI Score: <strong>{transaction.aiRiskScore}</strong>
                    </div>
                    <div className="small">
                      Source: <strong>AI + Rules</strong>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="fw-bold text-danger">{transaction.amount}</div>
                    <div className="small">Risk {transaction.riskScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
