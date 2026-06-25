import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, FileBarChart, LogOut, X } from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State para kontrolin ang paglabas ng nasa gitnang Logout Confirmation Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      
      {/* SIDEBAR CONTAINER */}
      <div className="d-flex flex-column flex-shrink-0 bg-dark text-white p-3 shadow-lg" 
           style={{ width: "260px", height: "100vh", position: "sticky", top: 0, zIndex: 100 }}>
        
        {/* Brand / Title Section */}
        <div className="mb-4 px-2 pt-2">
          <h5 className="fw-bold tracking-tight text-white m-0 d-flex align-items-center gap-2">
            <div className="bg-primary p-1.5 rounded-2 d-inline-flex text-white">
              <CalendarCheck size={18} />
            </div>
            <span className="text-white">Attendance MS</span>
          </h5>
        </div>

        <hr className="bg-light opacity-25 my-2" />

        {/* Navigation Links */}
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          <li className="nav-item">
            <Link to="/dashboard" className={`nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-medium transition-all ${isActive("/dashboard") ? "bg-primary text-white" : "text-white opacity-75 hover-bg-light-opacity"}`}>
              <LayoutDashboard size={18} className="text-white" />
              <span className="text-white">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/students" className={`nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-medium transition-all ${isActive("/students") ? "bg-primary text-white" : "text-white opacity-75 hover-bg-light-opacity"}`}>
              <Users size={18} className="text-white" />
              <span className="text-white">Students</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/attendance" className={`nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-medium transition-all ${isActive("/attendance") ? "bg-primary text-white" : "text-white opacity-75 hover-bg-light-opacity"}`}>
              <CalendarCheck size={18} className="text-white" />
              <span className="text-white">Attendance</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reports" className={`nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-medium transition-all ${isActive("/reports") ? "bg-primary text-white" : "text-white opacity-75 hover-bg-light-opacity"}`}>
              <FileBarChart size={18} className="text-white" />
              <span className="text-white">Reports</span>
            </Link>
          </li>
        </ul>

        <hr className="bg-light opacity-25 my-2" />

        {/* LOGOUT BUTTON */}
        <div className="mt-auto">
          <button 
            type="button"
            className="btn btn-danger w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3"
            onClick={() => setShowLogoutModal(true)} // Bubuksan ang modal sa gitna
          >
            <LogOut size={16} className="text-white" />
            <span className="text-white">Logout Account</span>
          </button>
        </div>

      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ height: "100vh" }}>
        <div className="mx-auto" style={{ maxWidth: "1300px" }}>
          {children}
        </div>
      </div>

      {/* --- PURE BOOTSTRAP LOGOUT MODAL (SA GITNA NG SCREEN) --- */}
      {showLogoutModal && (
        <>
          {/* Dark Backdrop Background */}
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          
          {/* Centered Modal Frame */}
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "100%", maxWidth: "400px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-3 bg-white">
                
                {/* Modal Header */}
                <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold text-dark" style={{ fontSize: "18px" }}>Confirm Sign Out</h5>
                  <button type="button" className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center" onClick={() => setShowLogoutModal(false)} style={{ width: "28px", height: "28px" }}>
                    <X size={16} className="text-secondary" />
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="modal-body py-3">
                  <p className="text-muted m-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                    Are you sure you want to log out of your account? You will need to enter your credentials again to gain dashboard access.
                  </p>
                </div>
                
                {/* Modal Footer / Action Buttons */}
                <div className="modal-footer border-0 pt-0 d-flex gap-2">
                  <button type="button" className="btn btn-light text-secondary border flex-grow-1 py-2 fw-semibold rounded-3" style={{ fontSize: "14px" }} onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger flex-grow-1 py-2 fw-semibold rounded-3 shadow-sm" style={{ fontSize: "14px" }} onClick={confirmLogout}>
                    Yes, Log Out
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}