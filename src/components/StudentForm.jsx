function StudentForm() {
    return (
      <form>
  
        <div className="mb-3">
          <label className="form-label">
            Student Name
          </label>
  
          <input
            type="text"
            className="form-control"
          />
        </div>
  
        <div className="mb-3">
          <label className="form-label">
            Course
          </label>
  
          <input
            type="text"
            className="form-control"
          />
        </div>
  
        <div className="mb-3">
          <label className="form-label">
            Section
          </label>
  
          <input
            type="text"
            className="form-control"
          />
        </div>
  
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save Student
        </button>
  
      </form>
    );
  }
  
  export default StudentForm;