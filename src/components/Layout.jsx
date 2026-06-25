import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarCheck, FileBarChart, LogOut, X, ShieldAlert } from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  
  const colors = {
    activeBg: "#f5f3ff",     
    activeText: "#4f46e5",   
    inactiveText: "#64748b", 
    inactiveIcon: "#94a3b8", 
    borderColor: "#e2e8f0"   
  };

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {}
      <div 
        className="d-flex flex-column flex-shrink-0 bg-white p-4" 
        style={{ 
          width: "260px", 
          height: "100vh", 
          position: "sticky", 
          top: 0, 
          zIndex: 100,
          borderRight: `1px solid ${colors.borderColor}` 
        }}
      >
        
        {}
        <div className="mb-4 px-1">
          <h5 className="fw-extrabold text-dark m-0 d-flex align-items-center gap-2.5" style={{ fontSize: "19px", letterSpacing: "-0.02em" }}>
            <div className="p-2 rounded-3 d-inline-flex text-white shadow-sm" style={{ backgroundColor: colors.activeText }}>
              <CalendarCheck size={18} strokeWidth={2.5} />
            </div>
            <span>Attendance <span style={{ color: colors.activeText }}>MS</span></span>
          </h5>
        </div>

        {}
        <div className="d-flex align-items-center gap-3 p-2.5 mb-3 rounded-4 bg-light border border-light">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin Avatar"
            className="rounded-circle shadow-sm bg-white"
            width="42"
            height="42"
          />
          <div className="overflow-hidden">
            <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: "14px" }}>Administrator</h6>
            <small className="text-muted d-block text-truncate" style={{ fontSize: "11px" }}>SAMS Core Registry</small>
          </div>
        </div>

        <hr className="text-muted opacity-25 my-2" />

        {}
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className="nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-semibold border-0 transition-all text-start"
              style={{
                fontSize: "14px",
                boxShadow: "none",
                backgroundColor: isActive("/dashboard") ? colors.activeBg : "transparent",
                color: isActive("/dashboard") ? colors.activeText : colors.inactiveText
              }}
            >
              <LayoutDashboard size={18} style={{ color: isActive("/dashboard") ? colors.activeText : colors.inactiveIcon }} />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/students" 
              className="nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-semibold border-0 transition-all text-start"
              style={{
                fontSize: "14px",
                boxShadow: "none",
                backgroundColor: isActive("/students") ? colors.activeBg : "transparent",
                color: isActive("/students") ? colors.activeText : colors.inactiveText
              }}
            >
              <Users size={18} style={{ color: isActive("/students") ? colors.activeText : colors.inactiveIcon }} />
              <span>Students</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/attendance" 
              className="nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-semibold border-0 transition-all text-start"
              style={{
                fontSize: "14px",
                boxShadow: "none",
                backgroundColor: isActive("/attendance") ? colors.activeBg : "transparent",
                color: isActive("/attendance") ? colors.activeText : colors.inactiveText
              }}
            >
              <CalendarCheck size={18} style={{ color: isActive("/attendance") ? colors.activeText : colors.inactiveIcon }} />
              <span>Attendance</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/reports" 
              className="nav-link d-flex align-items-center gap-3 py-2.5 px-3 rounded-3 fw-semibold border-0 transition-all text-start"
              style={{
                fontSize: "14px",
                boxShadow: "none",
                backgroundColor: isActive("/reports") ? colors.activeBg : "transparent",
                color: isActive("/reports") ? colors.activeText : colors.inactiveText
              }}
            >
              <FileBarChart size={18} style={{ color: isActive("/reports") ? colors.activeText : colors.inactiveIcon }} />
              <span>Reports</span>
            </Link>
          </li>
        </ul>

        <hr className="text-muted opacity-25 my-2" />

        {}
        <div className="mt-auto">
          <button 
            type="button"
            className="btn w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 rounded-3"
            style={{
              fontSize: "14px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              boxShadow: "none"
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </button>
        </div>

      </div>

      {}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto bg-light" style={{ height: "100vh" }}>
        <div className="mx-auto" style={{ maxWidth: "1350px" }}>
          {children}
        </div>
      </div>

      {}
      {showLogoutModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040, backgroundColor: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(4px)" }}></div>
          
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered m-0 p-3" style={{ width: "100%", maxWidth: "380px" }}>
              <div className="modal-content border-0 shadow-xl rounded-4 p-3 bg-white">
                
                <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2 text-danger">
                    <ShieldAlert size={20} />
                    <h5 className="modal-title fw-extrabold text-dark" style={{ fontSize: "16px" }}>Confirm Sign Out</h5>
                  </div>
                  <button type="button" className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center border-0" onClick={() => setShowLogoutModal(false)} style={{ width: "28px", height: "28px", backgroundColor: "#f1f5f9" }}>
                    <X size={14} className="text-secondary" />
                  </button>
                </div>
                
                <div className="modal-body py-3">
                  <p className="text-muted m-0" style={{ fontSize: "13.5px", lineHeight: "1.5" }}>
                    Sigurado ka bang nais mong lumabas? Kakailanganin mong mag-log in muli gamit ang iyong credentials upang ma-access ang system registry dashboards.
                  </p>
                </div>
                
                <div className="modal-footer border-0 pt-0 d-flex gap-2">
                  <button type="button" className="btn btn-light text-secondary border-0 flex-grow-1 py-2 fw-bold rounded-3" style={{ fontSize: "13px", backgroundColor: "#f1f5f9" }} onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger flex-grow-1 py-2 fw-bold rounded-3 shadow-sm border-0" style={{ fontSize: "13px" }} onClick={confirmLogout}>
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