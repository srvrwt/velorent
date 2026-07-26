import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/adminService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return <div className="admin-page">Loading users...</div>;
  }

  if (error) {
    return <div className="admin-page">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>Manage all registered users</p>
        </div>

        <div className="user-count">
          Total Users: <strong>{users.length}</strong>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.provider || "Local"}</td>
                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? "role-badge admin"
                          : "role-badge user"
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;