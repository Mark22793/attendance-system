import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Calendar, Layers, ShieldAlert, CheckCircle2, Clock, XCircle, CloudLightning, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [saving, setSaving] = useState(false);
  
  // --- CUSTOM NOTIFICATION MODAL STATES ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // FIXED LIST AT MAPPING ENGINE BASE SA MGA SCREENSHOTS MO
  const availableCourses = [
    "BS Computer Science",
    "BS Information Technology",
    "BS Business Administration",
    "BS Engineering"
  ];

  const courseSectionMapping = {
    "BS Computer Science": ["CS-2A", "CS-2B"],
    "BS Information Technology": ["IT-2A", "IT-2B"],
    "BS Business Administration": ["BA-1A", "BA-1B"],
    "BS Engineering": ["ENG-3A", "ENG-3B", "ENG-3C"]
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCourse, selectedSection]);

  // Awtomatikong i-reset ang section kapag binago ang kurso sa filters
  useEffect(() => {
    if (selectedCourse !== "ALL") {
      setSelectedSection("");
    }
  }, [selectedCourse]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5255/api/Student");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    let targetStudents = [];

    if (selectedCourse === "ALL" && selectedSection === "ALL") {
      targetStudents = students;
    } else if (selectedCourse && selectedSection) {
      targetStudents = students.filter(
        (s) => s.course === selectedCourse && s.section === selectedSection
      );
    }

    if (targetStudents.length > 0) {
      const list = targetStudents.map((s) => ({
        studentId: s.id, 
        studentName: s.name,
        course: s.course,
        section: s.section,
        status: "Present", 
      }));
      setAttendanceList(list);
    } else {
      setAttendanceList([]);
    }
  }, [selectedCourse, selectedSection, students]);

  const handleStatusChange = (actualIndex, newStatus) => {
    const updated = [...attendanceList];
    updated[actualIndex].status = newStatus;
    setAttendanceList(updated);
  };

  const handleSaveAttendance = async () => {
    if (attendanceList.length === 0) return;
    
    try {
      setSaving(true);
      
      const payload = {
        date: new Date().toISOString(), 
        records: attendanceList.map(item => ({
          studentId: item.studentId,    
          status: item.status,          
          studentName: item.studentName 
        }))
      };

      const response = await fetch("http://localhost:5255/api/Attendance/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save session");
      }

      const blockLabel = selectedCourse === "ALL" ? "All Students" : `${selectedCourse} - ${selectedSection}`;
      
      setSuccessMessage(`Attendance sheet for ${blockLabel} has been securely synchronized with the database.`);
      setShowSuccessModal(true);
      
      setSelectedCourse("");
      setSelectedSection("");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(`Error saving attendance records: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const totalItems = attendanceList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentAttendanceRows = attendanceList.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <Layout>
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 pb-3 border-bottom border-light">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: "28px" }}>Attendance Roll Call</h2>
          <p className="text-muted small mb-0">Select a course cluster block to log student session statuses today.</p>
        </div>
        <div>
          <span className="badge bg-white text-dark border p-2.5 rounded-3 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold" style={{ fontSize: "13px" }}>
            <Calendar size={16} className="text-primary" />
            <span>Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold text-secondary tracking-wider small mb-1">ACADEMIC COURSE</label>
              <select
                className="form-select bg-light border-0 text-dark fw-medium"
                style={{ height: "42px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                value={selectedCourse}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCourse(val);
                  if (val === "ALL") setSelectedSection("ALL");
                }}
              >
                <option value="">-- Choose Course Track --</option>
                <option value="ALL" className="fw-bold text-primary">⭐ All Registered Students (Full DB Load)</option>
                {availableCourses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-secondary tracking-wider small mb-1">ASSIGNED BLOCK SECTION</label>
              <select
                className="form-select bg-light border-0 text-dark fw-medium"
                style={{ height: "42px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedCourse} // Naka-disable kapag walang napiling course filter
              >
                {selectedCourse === "" && <option value="">-- Select Course First --</option>}
                {selectedCourse === "ALL" && <option value="ALL">All Sections (Auto-Mapped)</option>}
                
                {selectedCourse && selectedCourse !== "ALL" && (
                  <>
                    <option value="">-- Choose Section Block --</option>
                    {courseSectionMapping[selectedCourse]?.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN ATTENDANCE SHEET */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
        <div className="card-body p-0">
          {!selectedCourse || !selectedSection ? (
            <div className="text-center py-5 my-4 text-muted">
              <Layers size={42} className="text-muted opacity-25 mb-3" />
              <h5 className="fw-bold text-dark mb-1">Attendance Sheet is Locked</h5>
              <p className="small text-muted mb-0">Please select an academic filter from the dropdown matrix above to generate the list.</p>
            </div>
          ) : attendanceList.length === 0 ? (
            <div className="text-center py-5 my-4 text-muted">
              <ShieldAlert size={42} className="text-warning opacity-75 mb-3" />
              <h5 className="fw-bold text-dark mb-1">Zero Matches Found</h5>
              <p className="small text-muted mb-0">No registered students were found mapped inside the selected tracking rules.</p>
            </div>
          ) : (
            <>
              {/* TOP HEADER PREVIEW COUNTER */}
              <div className="bg-white p-4 border-bottom border-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>
                  Active Sheet: <span className="text-primary">{selectedCourse === "ALL" ? "All Tracks Combined" : `${selectedCourse} - ${selectedSection}`}</span>
                </span>
                <button
                  className="btn btn-primary fw-semibold px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
                  style={{ fontSize: "14px" }}
                  onClick={handleSaveAttendance}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Saving to Cloud DB...</span>
                    </>
                  ) : (
                    <>
                      <CloudLightning size={16} />
                      <span>Save Session Attendance</span>
                    </>
                  )}
                </button>
              </div>

              {/* TABLE CONTAINER */}
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-uppercase tracking-wider text-muted border-bottom border-light" style={{ fontSize: "11px", fontWeight: "700" }}>
                    <tr>
                      <th className="ps-4 py-3" style={{ width: "10%" }}># No.</th>
                      <th className="py-3">Student Name</th>
                      <th className="py-3" style={{ width: "22%" }}>Course Block</th>
                      <th className="pe-4 py-3 text-center" style={{ width: "35%" }}>Log Status Matrix</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "0" }}>
                    {currentAttendanceRows.map((item, localIndex) => {
                      const actualListIndex = indexOfFirstItem + localIndex;

                      return (
                        <tr key={actualListIndex}>
                          <td className="ps-4 py-3 text-secondary fw-semibold" style={{ fontSize: "13.5px" }}>#{actualListIndex + 1}</td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="fw-bold d-flex align-items-center justify-content-center rounded-circle bg-light text-primary text-uppercase" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                                {item.studentName ? item.studentName.charAt(0) : "?"}
                              </div>
                              <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{item.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0" style={{ fontSize: "12px", backgroundColor: "#f3f4f6", color: "#374151" }}>
                              {item.course} - {item.section}
                            </span>
                          </td>
                          <td className="pe-4 text-center py-3">
                            <div className="btn-group shadow-sm rounded-3 overflow-hidden border border-light" role="group">
                              <button
                                type="button"
                                className="btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 border-0"
                                style={{ fontSize: "13px", backgroundColor: item.status === "Present" ? "#dcfce7" : "#ffffff", color: item.status === "Present" ? "#15803d" : "#6b7280" }}
                                onClick={() => handleStatusChange(actualListIndex, "Present")}
                              >
                                <CheckCircle2 size={14} /> Present
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 border-0"
                                style={{ fontSize: "13px", backgroundColor: item.status === "Late" ? "#fef9c3" : "#ffffff", color: item.status === "Late" ? "#a16207" : "#6b7280" }}
                                onClick={() => handleStatusChange(actualListIndex, "Late")}
                              >
                                <Clock size={14} /> Late
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 border-0"
                                style={{ fontSize: "13px", backgroundColor: item.status === "Absent" ? "#fee2e2" : "#ffffff", color: item.status === "Absent" ? "#b91c1c" : "#6b7280" }}
                                onClick={() => handleStatusChange(actualListIndex, "Absent")}
                              >
                                <XCircle size={14} /> Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* SYSTEM REGISTRY PAGINATION */}
              <div className="bg-white border-top border-light p-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                <div className="text-muted small fw-medium">
                  Showing <span className="text-dark fw-bold">{indexOfFirstItem + 1}</span>–<span className="text-dark fw-bold">{Math.min(indexOfLastItem, totalItems)}</span> of <span className="text-dark fw-bold">{totalItems}</span> tracked records
                </div>
                
                {totalPages > 1 && (
                  <nav aria-label="Attendance network pagination">
                    <ul className="pagination mb-0 gap-1 border-0">
                      <li className={`page-item border-0 ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="btn btn-sm btn-white text-dark border px-2.5 py-1.5 rounded-2" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                          <ChevronLeft size={14} />
                        </button>
                      </li>
                      {getPageNumbers().map((page) => (
                        <li key={page} className="page-item border-0">
                          <button className={`btn btn-sm px-3 py-1.5 rounded-2 fw-semibold border-0 ${currentPage === page ? "btn-primary shadow-sm" : "btn-light text-secondary"}`} onClick={() => setCurrentPage(page)}>
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item border-0 ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="btn btn-sm btn-white text-dark border px-2.5 py-1.5 rounded-2" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                          <ChevronRight size={14} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- SUCCESS NOTIFICATION MODAL (SA PINAKAGITNA NG SCREEN) --- */}
      {showSuccessModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "100%", maxWidth: "400px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center bg-white">
                
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "56px", height: "56px", backgroundColor: "#dcfce7" }}>
                  <Check size={28} className="text-success" />
                </div>
                
                <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "19px" }}>Session Saved Successfully</h5>
                <p className="text-muted mb-4 small px-2" style={{ lineHeight: "1.5" }}>
                  {successMessage}
                </p>
                
                <button 
                  type="button" 
                  className="btn btn-dark w-100 py-2.5 fw-semibold rounded-3 shadow-sm" 
                  style={{ fontSize: "14px" }}
                  onClick={() => setShowSuccessModal(false)}
                >
                  Acknowledge & Close
                </button>

              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}