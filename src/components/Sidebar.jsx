import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardCheck,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      <div>
        <h3 className="text-center mb-3">SAMS</h3>
        <div className="text-center mb-4">

      <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
           alt="Admin"
              className="rounded-circle mb-2"
          width="80"
      />

         <h5 className="mb-0">Administrator</h5>
         <small className="text-light">
            Student Attendance System
          </small>

       </div>

        <hr />

        <ul className="nav flex-column">

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-primary text-white rounded mb-2"
                  : "nav-link text-white mb-2"
              }
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-primary text-white rounded mb-2"
                  : "nav-link text-white mb-2"
              }
            >
              <FaUsers className="me-2" />
              Students
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-primary text-white rounded mb-2"
                  : "nav-link text-white mb-2"
              }
            >
              <FaClipboardCheck className="me-2" />
              Attendance
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive
                  ? "nav-link bg-primary text-white rounded mb-2"
                  : "nav-link text-white mb-2"
              }
            >
              <FaChartBar className="me-2" />
              Reports
            </NavLink>
          </li>

        </ul>
      </div>

      <div className="mt-auto">
        <hr />

        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;