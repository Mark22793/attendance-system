import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(""); 

    
    const cleanedUsername = username.trim().toLowerCase();
    const cleanedPassword = password.trim();

    // 1. FRONTEND VALIDATION
    if (!cleanedUsername && !cleanedPassword) {
      setError("Please enter your username and password.");
      return;
    }
    if (!cleanedUsername) {
      setError("Username is required.");
      return;
    }
    if (!cleanedPassword) {
      setError("Password is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5255/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ipinapadala ang cleanedUsername (naka-lowercase) sa backend
        body: JSON.stringify({ username: cleanedUsername, password: cleanedPassword })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", data.role);
        navigate("/dashboard");
      } else {
        // 2. BACKEND VALIDATION
        setError("Incorrect username or password!");
      }
    } catch (err) {
      setError("Unable to connect to the backend server.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    }}>
      <div className="card border-0 shadow-lg p-5" style={{ width: "420px", borderRadius: "16px", backgroundColor: "#ffffff" }}>
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-sm" style={{ width: "60px", height: "60px" }}>
            <Lock size={28} />
          </div>
          <h2 className="fw-bold text-dark mb-1">Welcome Back</h2>
          <p className="text-muted small">Please enter your details to sign in</p>
        </div>
        
        {/* Dynamic Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 border-0 rounded-3 small mb-4" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <div className="fw-medium">{error}</div>
          </div>
        )}

        {/* Username Input */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">Username</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
              <User size={18} />
            </span>
            <input
              className="form-control border-start-0 ps-0"
              style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px", boxShadow: "none" }}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="form-label small fw-semibold text-secondary">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
              <Lock size={18} />
            </span>
            <input
              className="form-control border-x-0 ps-0"
              type={showPassword ? "text" : "password"}
              style={{ boxShadow: "none" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className="input-group-text bg-white border-start-0 text-muted" 
              style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Login Button */}
        <button 
          className="btn btn-primary w-100 py-2 fw-semibold shadow-sm" 
          style={{ borderRadius: "8px", fontSize: "16px" }}
          onClick={handleLogin}
        >
          Sign In
        </button>

      </div>
    </div>
  );
}

export default Login;