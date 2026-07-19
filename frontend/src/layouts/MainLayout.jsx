import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-velorent.webp";
import { getUser, logout } from "../utils/auth";

function MainLayout() {
      const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

    return (
        <>
            <header>
                <NavLink
                    to="/"
                    className="logo"

                >
                    <img src={Logo} alt="Velo Rent" />
                </NavLink>

                <nav className="flex gap_md align_center justify_center">
                    <NavLink
                        to="/explore-bikes"
                        className={({ isActive }) => (isActive ? "active" : "")}
                        end
                    >
                        Explore bikes
                    </NavLink>

                    <NavLink
                        to="/pricing"
                        className={({ isActive }) => (isActive ? "active" : "")}
                        end
                    >
                        Pricing
                    </NavLink>


                    <NavLink
                        to="/locations"
                        className={({ isActive }) => (isActive ? "active" : "")}
                        end
                    >
                        Locations
                    </NavLink>
                    <NavLink
                        to="/about-us"
                        className={({ isActive }) => (isActive ? "active" : "")}
                        end
                    >
                        About Us
                    </NavLink>



                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Dashboard
                    </NavLink>
                </nav>

                <div className="flex gap_md align_center justify_end">
 {user ? (
  <div className="user-info">
    <div className="avatar">
      {user.name.charAt(0).toUpperCase()}
    </div>

    <span>{user.name.split(" ")[0]}</span>

    <button onClick={handleLogout}>
      Logout
    </button>
  </div>
) : (
  <>
    <NavLink
      to="/login"
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      Login
    </NavLink>

    <NavLink
      to="/sign-up"
      className={({ isActive }) =>
        `button ${isActive ? "active" : ""}`
      }
    >
      Sign Up
    </NavLink>
  </>
)}
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;