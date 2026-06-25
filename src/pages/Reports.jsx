import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Calendar, RefreshCw, XCircle, Users, CheckCircle, Clock, AlertTriangle, Edit2, Check, X } from "lucide-react";

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const today = new Date();
    const localDateString = today.getFullYear() + "-" + 
      String(today.getMonth() + 1).padStart(2, '0') + "-" + 
      String(today.getDate()).padStart(2, '0');
    
    setSelectedDate(localDateString);
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [selectedDate, logs]);

  const fetchLogs = () => {
    fetch("http://localhost:5255/api/Attendance")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      })
      .catch((err) => console.error("Error loading logs:", err));
  };

  const handleUpdateStatus = (id) => {
    fetch(`http://localhost:5255/api/Attendance/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Status: tempStatus }) // Capital 'S' para tugma sa C# object
    })
      .then((res) => {
        if (res.ok) {
          setLogs(logs.map(log => log.id === id ? { ...log, status: tempStatus } : log));
          setEditingId(null);
        } else {
          alert("Failed to update status. Server error.");
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const formatLocalTime = (dateString) => {
    if (!dateString) return "00:00 AM";

    if (typeof dateString === 'string' && !dateString.includes("-") && (dateString.includes("AM") || dateString.includes("PM"))) {
      try {
        const dummyDate = new Date(`2026-06-23 ${dateString}`);
        if (!isNaN(dummyDate.getTime())) {
          const corrected = new Date(dummyDate.getTime() + (8 * 60 * 60 * 1000));
          return corrected.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        }
      } catch (e) {
        return dateString;
      }
    }

    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;

    const hasTimezoneIndicator = String(dateString).includes("Z") || String(dateString).includes("+");
    const PHILIPPINES_OFFSET = 8 * 60 * 60 * 1000;
    const correctedDate = hasTimezoneIndicator 
      ? parsedDate 
      : new Date(parsedDate.getTime() + PHILIPPINES_OFFSET);

    return correctedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatLocalDate = (dateString) => {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;

    const hasTimezoneIndicator = String(dateString).includes("Z") || String(dateString).includes("+");
    const correctedDate = hasTimezoneIndicator 
      ? parsedDate 
      : new Date(parsedDate.getTime() + (8 * 60 * 60 * 1000));

    return correctedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

  const applyFilter = () => {
    if (!selectedDate) {
      setFilteredLogs(logs);
      setCurrentPage(1);
      return;
    }

    const filtered = logs.filter((log) => {
      const logTarget = log.date || log.timestamp;
      if (!logTarget) return false;

      const logDate = new Date(logTarget);
      if (isNaN(logDate.getTime())) return false;

      const hasTimezoneIndicator = String(logTarget).includes("Z") || String(logTarget).includes("+");
      const correctedLogDate = hasTimezoneIndicator 
        ? logDate 
        : new Date(logDate.getTime() + (8 * 60 * 60 * 1000));

      const formattedLogDate = correctedLogDate.getFullYear() + "-" + 
        String(correctedLogDate.getMonth() + 1).padStart(2, '0') + "-" + 
        String(correctedLogDate.getDate()).padStart(2, '0');
      
      return formattedLogDate === selectedDate;
    });

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSelectedDate("");
  };

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return (
          <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0 d-inline-flex align-items-center gap-1" style={{ fontSize: "12px", backgroundColor: "#dcfce7", color: "#15803d" }}>
            <CheckCircle size={13} /> Present
          </span>
        );
      case "late":
        return (
          <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0 d-inline-flex align-items-center gap-1" style={{ fontSize: "12px", backgroundColor: "#fef3c7", color: "#b45309" }}>
            <Clock size={13} /> Late
          </span>
        );
      case "absent":
        return (
          <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0 d-inline-flex align-items-center gap-1" style={{ fontSize: "12px", backgroundColor: "#fee2e2", color: "#b91c1c" }}>
            <AlertTriangle size={13} /> Absent
          </span>
        );
      default:
        return (
          <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0 bg-light text-secondary" style={{ fontSize: "12px" }}>
            {status}
          </span>
        );
    }
  };

  return (
    <Layout>
      {/* HEADER SECTION */}
      <div className="mb-5 pb-3 border-bottom border-light">
        <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: "28px" }}>Attendance Reports</h2>
        <p className="text-muted small mb-0">Audit, parse, and filter historical student tracking system logs.</p>
      </div>

      {/* FILTER CONTROL REGISTRY CARD */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-4">
          <label className="form-label fw-bold text-secondary tracking-wider small mb-2">FILTER LOG REGISTRY</label>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div className="input-group" style={{ maxWidth: "320px" }}>
              <span className="input-group-text bg-light border-end-0 text-muted px-3" style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
                <Calendar size={15} />
              </span>
              <input
                type="date"
                className="form-control bg-light border-start-0 ps-1"
                style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light border px-3 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2 text-dark" style={{ fontSize: "14px" }} onClick={fetchLogs}>
                <RefreshCw size={15} /> Refresh Logs
              </button>
              {selectedDate && (
                <button className="btn btn-light text-danger border px-3 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2" style={{ fontSize: "14px" }} onClick={clearFilter}>
                  <XCircle size={15} /> Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER TABLE COMPONENT */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase tracking-wider text-muted border-bottom border-light" style={{ fontSize: "11px", fontWeight: "700" }}>
                <tr>
                  <th className="ps-4 py-3">Student Profiling</th>
                  <th className="py-3" style={{ width: "22%" }}>Metrics Status</th>
                  <th className="py-3" style={{ width: "22%" }}>Calendar Date</th>
                  <th className="py-3" style={{ width: "20%" }}>Time Stamp</th>
                  <th className="pe-4 py-3 text-end" style={{ width: "12%" }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "0" }}>
                {currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 my-4 text-muted">
                      <Users size={40} className="text-muted opacity-25 mb-3" />
                      <h5 className="fw-bold text-dark mb-1">No Log Rows Located</h5>
                      <p className="small text-muted mb-0">No active tracking records match the selected parameters.</p>
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log, index) => (
                    <tr key={log.id || index}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="fw-bold d-flex align-items-center justify-content-center rounded-circle bg-light text-primary text-uppercase" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                            {log.studentName ? log.studentName.charAt(0) : (log.name ? log.name.charAt(0) : "?")}
                          </div>
                          <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{log.studentName || log.name}</span>
                        </div>
                      </td>
                      
                      <td className="py-3">
                        {editingId === log.id ? (
                          <select 
                            className="form-select form-select-sm fw-semibold" 
                            style={{ maxWidth: "130px", fontSize: "13px" }}
                            value={tempStatus} 
                            onChange={(e) => setTempStatus(e.target.value)}
                          >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                          </select>
                        ) : (
                          getStatusBadge(log.status)
                        )}
                      </td>

                      <td className="py-3 text-secondary" style={{ fontSize: "14px" }}>
                        {formatLocalDate(log.date || log.timestamp)}
                      </td>
                      <td className="py-3 fw-bold text-dark" style={{ fontSize: "14px" }}>
                        {formatLocalTime(log.timestamp || log.date)}
                      </td>

                      <td className="pe-4 py-3 text-end">
                        {editingId === log.id ? (
                          <div className="d-flex justify-content-end gap-1">
                            <button className="btn btn-sm btn-success d-inline-flex p-1.5 rounded-2" onClick={() => handleUpdateStatus(log.id)}>
                              <Check size={14} />
                            </button>
                            <button className="btn btn-sm btn-light border d-inline-flex p-1.5 rounded-2 text-danger" onClick={() => setEditingId(null)}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-sm btn-white text-dark border shadow-sm px-2.5 py-1.5 rounded-2 fw-semibold d-inline-flex align-items-center gap-1"
                            style={{ fontSize: "12px" }}
                            onClick={() => {
                              setEditingId(log.id);
                              setTempStatus(log.status || "Present");
                            }}
                          >
                            <Edit2 size={12} className="text-muted" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION INTERFACE */}
        {totalItems > 0 && (
          <div className="bg-white border-top border-light p-4 d-flex justify-content-between align-items-center">
            <div className="text-muted small fw-medium">
              Showing <span className="text-dark fw-bold">{indexOfFirstItem + 1}</span>–<span className="text-dark fw-bold">{Math.min(indexOfLastItem, totalItems)}</span> of <span className="text-dark fw-bold">{totalItems}</span> registry entries
            </div>
            {totalPages > 1 && (
              <nav>
                <ul className="pagination mb-0 gap-1 border-0">
                  <li className={`page-item border-0 ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="btn btn-sm btn-white text-dark border px-2.5 py-1.5 rounded-2" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((page) => (
                    <li key={page + 1} className="page-item border-0">
                      <button className={`btn btn-sm px-3 py-1.5 rounded-2 fw-semibold border-0 ${currentPage === page + 1 ? "btn-primary shadow-sm" : "btn-light text-secondary"} `} onClick={() => setCurrentPage(page + 1)}>
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item border-0 ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="btn btn-sm btn-white text-dark border px-2.5 py-1.5 rounded-2" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}