import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Search, UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight, Users, X, AlertTriangle, Check } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({ name: "", course: "", section: "" });
  
  // Validation Error States para sa Modal Inputs
  const [errors, setErrors] = useState({});

  // --- CUSTOM CENTRAL MODAL STATES ---
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 1. FIXED LIST NG COURSES
  const availableCourses = [
    "BS Computer Science",
    "BS Information Technology",
    "BS Business Administration",
    "BS Engineering"
  ];

  // 2. MAPPING ENGINE PARA SA MGA MAGKAKAKONEKTANG SECTIONS
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
  }, [searchTerm, selectedCourse, selectedSection]);

  // Awtomatikong linisin ang section filter kapag nagbago ang course filter sa main page
  useEffect(() => {
    setSelectedSection("");
  }, [selectedCourse]);

  // Awtomatikong linisin ang section data sa modal kapag binago ang kurso habang nag-eedit/add
  const handleCourseChangeInModal = (courseValue) => {
    setFormData({
      ...formData,
      course: courseValue,
      section: "" // Reset ang section para iwas conflict sa lumang kurso
    });
  };

  const fetchStudents = () => {
    fetch("http://localhost:5255/api/Student")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error loading students:", err));
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateForm = () => {
    let tempErrors = {};
    const nameRegex = /^[a-zA-Z\s.,'-]+$/; 

    if (!formData.name.trim()) {
      tempErrors.name = "Student name is required.";
    } else if (!nameRegex.test(formData.name)) {
      tempErrors.name = "Numbers and special characters are not allowed in names.";
    }

    if (!formData.course) {
      tempErrors.course = "Please select a course block.";
    }

    if (!formData.section) {
      tempErrors.section = "Please select a section code.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const openDeleteConfirmation = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    fetch(`http://localhost:5255/api/Student/${deleteTarget.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          const removedName = deleteTarget.name;
          setDeleteTarget(null);
          fetchStudents();
          
          setSuccessMessage(`The student profile registry for ${removedName} has been completely dropped from the system.`);
          setShowSuccessModal(true);
        } else {
          alert("Failed to delete student registry record.");
        }
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  const handleEditClick = (student) => {
    setIsEditMode(true);
    setCurrentStudentId(student.id);
    setFormData({ name: student.name, course: student.course || "", section: student.section || "" });
    setErrors({});
    setShowModal(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setCurrentStudentId(null);
    setFormData({ name: "", course: "", section: "" });
    setErrors({});
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const cleanPayload = {
      ...formData,
      name: formData.name.trim()
    };

    const url = isEditMode 
      ? `http://localhost:5255/api/Student/${currentStudentId}` 
      : "http://localhost:5255/api/Student";
      
    const method = isEditMode ? "PUT" : "POST";
    const payload = isEditMode ? { id: currentStudentId, ...cleanPayload } : cleanPayload;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) {
          setShowModal(false);
          fetchStudents();
          
          setSuccessMessage(isEditMode 
            ? `Changes to the workspace identity of ${cleanPayload.name} have been updated successfully.`
            : `New identity profile for ${cleanPayload.name} has been enrolled into the student body registry.`
          );
          setShowSuccessModal(true);
        } else {
          const errorData = await res.json();
          alert(errorData.message || "An error occurred while saving the profile.");
        }
      })
      .catch((err) => console.error("Error saving student data:", err));
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse ? s.course === selectedCourse : true;
    const matchesSection = selectedSection ? s.section === selectedSection : true;
    return matchesSearch && matchesCourse && matchesSection;
  });

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

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
          <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: "28px" }}>Student Profiles</h2>
          <p className="text-muted small mb-0">View, search, and audit system-wide registered academic student units.</p>
        </div>
        <button className="btn btn-primary px-4 py-2 fw-semibold shadow-sm rounded-3 d-inline-flex align-items-center gap-2" style={{ fontSize: "14px" }} onClick={handleAddClick}>
          <UserPlus size={16} /> Add Student
        </button>
      </div>

      {/* FILTER CONTROLS CARD */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-4 col-md-12">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted px-3" style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 ps-1"
                  style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                  placeholder="Search student profile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <select className="form-select bg-light border-0 text-dark" style={{ height: "40px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">All Courses</option>
                {availableCourses.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div className="col-lg-4 col-md-6">
              <select className="form-select bg-light border-0 text-dark" style={{ height: "40px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }} value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                <option value="">All Sections</option>
                {/* CONNECTED SECTIONS DITO SA FILTER */}
                {selectedCourse && courseSectionMapping[selectedCourse]
                  ? courseSectionMapping[selectedCourse].map((sec) => (<option key={sec} value={sec}>{sec}</option>))
                  : Object.values(courseSectionMapping).flat().map((sec) => (<option key={sec} value={sec}>{sec}</option>))
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE ENGINE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase tracking-wider text-muted border-bottom border-light" style={{ fontSize: "11px", fontWeight: "700" }}>
                <tr>
                  <th className="ps-4 py-3" style={{ width: "12%" }}>Database ID</th>
                  <th className="py-3">Full Student Label</th>
                  <th className="py-3" style={{ width: "20%" }}>Course Block</th>
                  <th className="py-3" style={{ width: "20%" }}>Section Unit</th>
                  <th className="pe-4 py-3 text-end" style={{ width: "15%" }}>Terminal Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: "0" }}>
                {currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 my-4 text-muted">
                      <Users size={40} className="text-muted opacity-25 mb-3" />
                      <h5 className="fw-bold text-dark mb-1">No Profile Rows Located</h5>
                      <p className="small text-muted mb-0">No active students match the specified filtering parameters.</p>
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="ps-4 py-3 text-secondary fw-semibold" style={{ fontSize: "13.5px" }}>#{student.id}</td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="fw-bold d-flex align-items-center justify-content-center rounded-circle bg-light text-primary text-uppercase" style={{ width: "36px", height: "36px", fontSize: "13px" }}>
                            {student.name ? student.name.charAt(0) : "?"}
                          </div>
                          <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0" style={{ fontSize: "12px", backgroundColor: "#e0f2fe", color: "#0369a1" }}>
                          {student.course}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="badge px-2.5 py-1.5 rounded-3 fw-semibold border-0" style={{ fontSize: "12px", backgroundColor: "#f3f4f6", color: "#374151" }}>
                          {student.section}
                        </span>
                      </td>
                      <td className="pe-4 text-end py-3">
                        <div className="d-flex gap-1 justify-content-end">
                          <button className="btn btn-white text-secondary border btn-sm rounded-2 p-2 d-inline-flex" onClick={() => handleEditClick(student)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-white text-danger border btn-sm rounded-2 p-2 d-inline-flex" onClick={() => openDeleteConfirmation(student.id, student.name)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM REGISTRY PAGINATION */}
        {totalItems > 0 && (
          <div className="bg-white border-top border-light p-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <div className="text-muted small fw-medium">
              Showing <span className="text-dark fw-bold">{indexOfFirstItem + 1}</span>–<span className="text-dark fw-bold">{Math.min(indexOfLastItem, totalItems)}</span> of <span className="text-dark fw-bold">{totalItems}</span> total students
            </div>
            {totalPages > 1 && (
              <nav aria-label="Profiles network pagination">
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
        )}
      </div>

      {/* COMPACT SECURE FORM POPUP MODAL */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "100%", maxWidth: "460px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-2 bg-white">
                <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold text-dark" style={{ fontSize: "18px" }}>
                    {isEditMode ? "Modify Student Entry" : "Create Student Identity"}
                  </h5>
                  <button type="button" className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center" onClick={() => setShowModal(false)} style={{ width: "28px", height: "28px" }}>
                    <X size={16} className="text-secondary" />
                  </button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body py-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary tracking-wider small mb-1">STUDENT FULL NAME</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : "bg-light border-0"}`}
                        style={{ height: "42px", borderRadius: "8px", fontSize: "14px" }}
                        placeholder="e.g. Mark Santos"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: capitalizeWords(e.target.value) })}
                      />
                      {errors.name && <div className="invalid-feedback fw-medium small mt-1">{errors.name}</div>}
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary tracking-wider small mb-1">COURSE BLOCK</label>
                        <select
                          className={`form-select ${errors.course ? "is-invalid" : "bg-light border-0"}`}
                          style={{ height: "42px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                          value={formData.course}
                          onChange={(e) => handleCourseChangeInModal(e.target.value)}
                        >
                          <option value="">Select Course</option>
                          {availableCourses.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.course && <div className="invalid-feedback fw-medium small mt-1">{errors.course}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary tracking-wider small mb-1">SECTION CODE</label>
                        {/* LINKED SECTIONS: Nakadepende sa kung anong napiling course sa itaas */}
                        <select
                          className={`form-select ${errors.section ? "is-invalid" : "bg-light border-0"}`}
                          style={{ height: "42px", borderRadius: "8px", fontSize: "14px", boxShadow: "none" }}
                          value={formData.section}
                          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                          disabled={!formData.course} // Naka-disable kapag walang napiling kurso
                        >
                          <option value="">
                            {!formData.course ? "Select Course First" : "Select Section"}
                          </option>
                          {formData.course && courseSectionMapping[formData.course]?.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                          ))}
                        </select>
                        {errors.section && <div className="invalid-feedback fw-medium small mt-1">{errors.section}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 d-flex gap-2">
                    <button type="button" className="btn btn-light text-secondary border flex-grow-1 py-2 fw-semibold rounded-3" style={{ fontSize: "14px" }} onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-semibold rounded-3 shadow-sm" style={{ fontSize: "14px" }}>
                      {isEditMode ? "Save Workspace Changes" : "Confirm Enrollment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {deleteTarget && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "100%", maxWidth: "400px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center bg-white">
                
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "56px", height: "56px", backgroundColor: "#fee2e2" }}>
                  <AlertTriangle size={28} className="text-danger" />
                </div>
                
                <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "19px" }}>Remove Student Profile?</h5>
                <p className="text-muted mb-4 small px-2" style={{ lineHeight: "1.5" }}>
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This destructive process cannot be undone within the database engine.
                </p>
                
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light text-secondary border flex-grow-1 py-2 fw-semibold rounded-3" style={{ fontSize: "14px" }} onClick={() => setDeleteTarget(null)}>
                    No, Retain Row
                  </button>
                  <button type="button" className="btn btn-danger flex-grow-1 py-2 fw-semibold rounded-3 shadow-sm" style={{ fontSize: "14px" }} onClick={executeDelete}>
                    Yes, Purge Record
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* --- CUSTOM SUCCESS FEEDBACK MODAL --- */}
      {showSuccessModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "100%", maxWidth: "400px" }}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-center bg-white">
                
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "56px", height: "56px", backgroundColor: "#dcfce7" }}>
                  <Check size={28} className="text-success" />
                </div>
                
                <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "19px" }}>Registry Sync Successful</h5>
                <p className="text-muted mb-4 small px-2" style={{ lineHeight: "1.5" }}>
                  {successMessage}
                </p>
                
                <button type="button" className="btn btn-dark w-100 py-2.5 fw-semibold rounded-3 shadow-sm" style={{ fontSize: "14px" }} onClick={() => setShowSuccessModal(false)}>
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