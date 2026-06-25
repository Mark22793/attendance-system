export default function AttendanceHistory() {
    const records = [
      { date: "06/16/26", student: "Juan", status: "Present" },
      { date: "06/16/26", student: "Maria", status: "Absent" },
    ];
  
    return (
      <div>
        <h2>Attendance History</h2>
  
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Status</th>
            </tr>
          </thead>
  
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.student}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }