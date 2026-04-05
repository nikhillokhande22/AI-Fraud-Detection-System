import React, { useEffect, useState } from "react";
import { getTransactions, getFraudTransactions } from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [fraudTransactions, setFraudTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

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

  return (
    <div className="card border-0 shadow-sm panel-card h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-1">Transaction Monitor</h4>
            <p className="text-muted mb-0">
              Review the latest activity and quickly identify suspicious transactions.
            </p>
          </div>

          <button className="btn btn-outline-dark btn-sm" onClick={loadTransactions}>
            Refresh
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="border rounded-4 p-3 bg-light">
              <div className="small text-muted">All Transactions</div>
              <div className="fs-4 fw-bold">{transactions.length}</div>
            </div>
          </div>

          <div className="col-6">
            <div className="border rounded-4 p-3 bg-light">
              <div className="small text-muted">Fraud Transactions</div>
              <div className="fs-4 fw-bold text-danger">{fraudTransactions.length}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mb-0">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="mb-0 text-muted">No transactions found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Device</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice().reverse().slice(0, 8).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.user?.name || transaction.user?.id || "-"}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.location}</td>
                    <td>{transaction.device}</td>
                    <td>{transaction.riskScore}</td>
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

        {!loading && fraudTransactions.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold mb-3">Latest Fraud Alerts</h6>
            <div className="d-flex flex-column gap-2">
              {fraudTransactions.slice().reverse().slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-4 p-3 d-flex justify-content-between align-items-center bg-danger-subtle"
                >
                  <div>
                    <div className="fw-semibold">
                      User: {transaction.user?.name || transaction.user?.id || "-"}
                    </div>
                    <div className="small text-muted">
                      {transaction.location} • {transaction.device}
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
