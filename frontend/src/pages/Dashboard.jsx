import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleProfileChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }

  function handlePasswordChange(e) {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  }

  function handleProfileSubmit(e) {
    e.preventDefault();

    // TODO:
    // axios.put("/api/users/profile", profile)

    alert("Profile Updated");
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TODO:
    // axios.put("/api/users/change-password", passwordData)

    alert("Password Updated");

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  if (!user) {
    return (
      <div className="page_container dashboard_login">
        <h1>Dashboard</h1>

        <p>Please login to continue.</p>

        <Link className="button" to="/login">
          Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="dashboard page_container">

        <div className="dashboard_grid">

          {/* LEFT CARD */}

          <div className="ride_card">

            <small>CURRENT SESSION</small>

            <h2>Volt-Z Motorcycle</h2>

            <div className="ride_stats">

              <div>
                <span>Time Remaining</span>
                <h3>42:15</h3>
              </div>

              <div>
                <span>Distance</span>
                <h3>12.4 km</h3>
              </div>

            </div>

            <div className="ride_buttons">

              <button>
                View Trip Details
              </button>

              <button className="outline">
                End Rental
              </button>

            </div>

          </div>

          {/* PROFILE */}

          <div className="profile_card">

            <h2>Profile & Security</h2>

            <div className="profile_header">

              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>

                <h3>{user.name}</h3>

                <p>{user.email}</p>

              </div>

            </div>

            <form onSubmit={handleProfileSubmit}>

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />

              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
              />

              <button className="update_btn">
                Update Profile
              </button>

            </form>

            <button
              className="change_password"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password →
            </button>

            <button
              className="logout_btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="booking_card">

          <div className="booking_header">

            <h2>Recent Bookings</h2>

            <Link to="/">
              View All
            </Link>

          </div>

          <div className="booking_item">

            <div>

              <strong>Volt-Z #392</strong>

              <p>May 14, 2026</p>

            </div>

            <strong>$14.20</strong>

          </div>

          <div className="booking_item">

            <div>

              <strong>UrbanGlide</strong>

              <p>May 11, 2026</p>

            </div>

            <strong>$5.50</strong>

          </div>

        </div>

      </section>

      {/* PASSWORD MODAL */}

      {showPasswordModal && (

        <div className="modal_overlay">

          <div className="password_modal">

            <h2>Change Password</h2>

            <form onSubmit={handlePasswordSubmit}>

              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />

              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />

              <div className="modal_buttons">

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Update Password
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}

export default Dashboard;