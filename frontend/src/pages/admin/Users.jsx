import { useEffect, useState } from "react";
import ViewUserModal from "../../components/ViewUserModal";
import EditUserModal from "../../components/EditUserModal";
import AddUserModal from "../../components/AddUserModal";
import View from "../../assets/icons/view.svg";
import Edit from "../../assets/icons/edit.svg";

import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/adminService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  function handleViewUser(user) {
    setSelectedUser(user);
    setShowViewModal(true);
  }

  function handleEditUser(user) {
    setSelectedUser(user);
    setShowEditModal(true);
  }

  async function handleSaveUser(id, userData) {
    try {
      const updatedUser = await updateUser(id, userData);

      const loggedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (
        loggedUser &&
        loggedUser._id === updatedUser._id
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? updatedUser : user
        )
      );

      setShowEditModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteUser(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

      setShowEditModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.log(error);
    }
  }

  async function handleAddUser(userData) {
    try {
      const newUser = await createUser(userData);

      setUsers((prev) => [
        newUser,
        ...prev,
      ]);

      setShowAddModal(false);

    } catch (error) {
      console.log(error);
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {

    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-page">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Page Header */}
      <div className="admin-page-header flex align_bottom space_between gap_sm">

        <div>
          <h1 className="color_green">
            Users
          </h1>

          <p className="mt_exsm color_light font_small">
            Manage all registered users
          </p>
        </div>

        <button
          className="button"
          onClick={() => setShowAddModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M427-100.78V-427H100.78v-106H427v-326.22h106V-533h326.22v106H533v326.22H427Z" /></svg>
          Add User
        </button>



      </div>


      {/* Filters */}
      <div className="filters flex align_center space_between gap_sm mt_lg">

        {/* Search */}
        <div className="search-box">
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        {/* Role Filter */}
        <div className="role-filter flex align_center gap_sm">
          <div className="user-count color_light font_small">
            Total Users:{" "}
            {users.length}
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="all">
              All Roles
            </option>

            <option value="user">
              Users
            </option>

            <option value="admin">
              Admins
            </option>

          </select>

        </div>

      </div>


      {/* Users Table */}
      <div className="table-wrapper mt_xsm">

        <table>

          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>

                  {/* Serial Number */}
                  <td>
                    {index + 1}
                  </td>

                  <td>
                    <div className="user-cell">
                      <div>
                        <div className="user-name">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.provider || "Local"}
                  </td>

                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? "badge admin"
                          : "badge user"
                      }
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewUser(user)}
                      >
                        <img src={View} alt="View" />
                      </button>

                      <button
                        className="btn-edit"
                        onClick={() => handleEditUser(user)}
                      >
                        <img src={Edit} alt="Edit" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No users found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>


      {/* View User Modal */}
      {showViewModal && (

        <ViewUserModal
          user={selectedUser}
          onClose={() => {
            setShowViewModal(false);
            setSelectedUser(null);
          }}
        />

      )}


      {/* Edit User Modal */}
      {showEditModal && (

        <EditUserModal
          user={selectedUser}

          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}

          onSave={handleSaveUser}

          onDelete={handleDeleteUser}
        />

      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}

    </div>
  );
}

export default Users;
