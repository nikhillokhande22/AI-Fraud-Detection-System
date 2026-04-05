import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FraudChart({ risk, transactions = [] }) {
  const riskData = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        label: "Transactions",
        data: [risk.high || 0, risk.medium || 0, risk.low || 0],
        backgroundColor: ["#dc3545", "#f59e0b", "#10b981"],
        borderRadius: 10,
        maxBarThickness: 56
      }
    ]
  };

  const grouped = transactions.reduce((acc, transaction) => {
    const dateKey = transaction.timestamp
      ? new Date(transaction.timestamp).toLocaleDateString()
      : "Unknown";

    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }

    if (transaction.fraud) {
      acc[dateKey] += 1;
    }

    return acc;
  }, {});

  const trendLabels = Object.keys(grouped);
  const trendValues = Object.values(grouped);

  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Fraud Trend",
        data: trendValues,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        fill: true,
        tension: 0.35
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm panel-card h-100">
      <div className="card-body p-4">
        <h4 className="mb-1">Risk & Fraud Trends</h4>
        <p className="text-muted mb-4">
          Distribution of transaction risk and fraud activity over time.
        </p>

        <div className="chart-block mb-4">
          <h6 className="fw-bold mb-3">Risk Distribution</h6>
          <div style={{ height: "260px" }}>
            <Bar data={riskData} options={commonOptions} />
          </div>
        </div>

        <div className="chart-block">
          <h6 className="fw-bold mb-3">Fraud Trend</h6>
          <div style={{ height: "220px" }}>
            <Line data={trendData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FraudChart;
