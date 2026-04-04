import React, { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/api";

const Users = ({ onActionComplete }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (user) => {
    try {
      if (user.blocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }

      await loadUsers();
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="card border-0 shadow-sm panel-card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h4 className="mb-1">User Management</h4>
            <p className="text-muted mb-0">
              Review registered users and block suspicious accounts when needed.
            </p>
          </div>

          <button className="btn btn-outline-dark btn-sm" onClick={loadUsers}>
            Refresh Users
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p className="mb-0">Loading users...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.balance}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.blocked ? (
                        <span className="badge text-bg-danger">Blocked</span>
                      ) : (
                        <span className="badge text-bg-success">Active</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${user.blocked ? "btn-success" : "btn-danger"}`}
                        onClick={() => handleToggle(user)}
                      >
                        {user.blocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
