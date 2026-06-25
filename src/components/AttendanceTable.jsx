function AttendanceTable() {
    const attendance = [
      {
        id: 1,
        student: "Juan Dela Cruz",
        status: "Present",
      },
      {
        id: 2,
        student: "Maria Santos",
        status: "Absent",
      },
    ];
  
    return (
      <table className="table table-bordered">
  
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Status</th>
          </tr>
        </thead>
  
        <tbody>
          {attendance.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.student}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
  
      </table>
    );
  }
  
  export default AttendanceTable;