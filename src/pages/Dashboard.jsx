import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut as DoughnutChart, Bar as BarChart } from "react-chartjs-2";
// Inimport ang modernong Lucide icons
import { Users, CheckCircle2, Clock, AlertTriangle, RefreshCw, PieChart, BarChart3 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [lateToday, setLateToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [courseDataDistribution, setCourseDataDistribution] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. KUNIN ANG KASALUKUYANG BILANG NG MGA ESTUDYANTE
      const studentRes = await fetch("http://localhost:5255/api/Student");
      const students = await studentRes.json();
      setTotalStudents(students.length);

      // Pag-asikasong map para sa kurso (Bar Chart)
      const courseCounts = {};
      students.forEach((s) => {
        if (s.course) {
          const courseUpper = s.course.toUpperCase();
          courseCounts[courseUpper] = (courseCounts[courseUpper] || 0) + 1;
        }
      });
      setCourseDataDistribution({
        labels: Object.keys(courseCounts),
        data: Object.values(courseCounts)
      });

      // 2. KUNIN ANG ATTENDANCE RECORDS AT I-FILTER ANG TSUBIBO NG TIMEZONE
      const attendanceRes = await fetch("http://localhost:5255/api/Attendance");
      const attendanceRecords = await attendanceRes.json();
      
      // Kumuha ng system timestamps para sa Araw na ito (Local Timezone)
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0-11
      const currentDay = today.getDate();

      // Dito natin sisiguraduhin na ang kukunin lang ay ang mga log na tumutugma sa eksaktong petsa ngayon
      const todayLogs = attendanceRecords.filter((rec) => {
        if (!rec.date) return false;
        
        const recordDate = new Date(rec.date);
        
        // Kinukumpara ang eksaktong Taon, Buwan, at Araw sa Local Time ng browser
        return (
          recordDate.getFullYear() === currentYear &&
          recordDate.getMonth() === currentMonth &&
          recordDate.getDate() === currentDay
        );
      });

      // 3. I-UPDATE ANG MGA STATE COUNTERS MULA SA NA-FILTER NA DATA
      setPresentToday(todayLogs.filter((r) => r.status === "Present").length);
      setLateToday(todayLogs.filter((r) => r.status === "Late").length);
      setAbsentToday(todayLogs.filter((r) => r.status === "Absent").length);

    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const doughnutChartData = {
    labels: ["Present Today", "Late Arrivals", "Absences"],
    datasets: [
      {
        data: [presentToday, lateToday, absentToday],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], 
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const barChartData = {
    labels: courseDataDistribution.labels.length > 0 ? courseDataDistribution.labels : ["BSIT", "BSCS", "BSCPE", "BSCRIM"],
    datasets: [
      {
        label: "Registered Students",
        data: courseDataDistribution.data.length > 0 ? courseDataDistribution.data : [0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.85)", 
        borderRadius: 8,
        borderWidth: 0,
        barThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 12, weight: "500" }, padding: 15 }
      },
    },
  };

  return (
    <Layout>
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 pb-3 border-bottom border-light">
        <div>
          <h2 className="fw-extrabold text-dark tracking-tight mb-1" style={{ fontSize: "28px" }}>Dashboard Overview</h2>
          <p className="text-muted small mb-0">Monitor and visualize real-time campus attendance dynamics.</p>
        </div>
        <div>
          <button className="btn btn-white text-dark border shadow-sm d-inline-flex align-items-center px-3 py-2 fw-semibold rounded-3 gap-2" onClick={fetchDashboardData} style={{ transition: "all 0.2s", fontSize: "14px" }}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status"></div>
          <p className="text-secondary fw-medium">Syncing database registers...</p>
        </div>
      ) : (
        <>
          {/* TOP ANALYTICS CARDS */}
          <div className="row g-4 mb-5">
            {/* CARD 1: TOTAL */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-uppercase text-muted fw-bold small tracking-wider d-block mb-1" style={{ fontSize: "11px" }}>Total Students</span>
                    <h3 className="fw-bold text-dark mb-0">{totalStudents}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: PRESENT */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="p-3 bg-success bg-opacity-10 text-success rounded-4 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="text-uppercase text-muted fw-bold small tracking-wider d-block mb-1" style={{ fontSize: "11px" }}>Present Today</span>
                    <h3 className="fw-bold text-dark mb-0">{presentToday}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: LATE */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-4 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="text-uppercase text-muted fw-bold small tracking-wider d-block mb-1" style={{ fontSize: "11px" }}>Late Arrivals</span>
                    <h3 className="fw-bold text-dark mb-0">{lateToday}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: ABSENT */}
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-4 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <span className="text-uppercase text-muted fw-bold small tracking-wider d-block mb-1" style={{ fontSize: "11px" }}>Absences</span>
                    <h3 className="fw-bold text-dark mb-0">{absentToday}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL CHART TILES */}
          <div className="row g-4">
            {/* CHART PANEL A */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-2">
                <div className="card-header bg-white border-0 pt-3 px-3 d-flex align-items-center gap-2">
                  <PieChart size={18} className="text-secondary" />
                  <div>
                    <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "16px" }}>Attendance Breakdown</h5>
                    <p className="text-muted small mb-0">Status analysis for the current session data.</p>
                  </div>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center px-3 py-4" style={{ minHeight: "280px" }}>
                  {presentToday === 0 && lateToday === 0 && absentToday === 0 ? (
                    <div className="text-center text-muted py-4">
                      <PieChart size={40} className="opacity-25 mb-2" />
                      <span className="small d-block">No logs recorded today.</span>
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: "240px" }}>
                      <DoughnutChart data={doughnutChartData} options={chartOptions} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CHART PANEL B */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-2">
                <div className="card-header bg-white border-0 pt-3 px-3 d-flex align-items-center gap-2">
                  <BarChart3 size={18} className="text-secondary" />
                  <div>
                    <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "16px" }}>Course Distribution</h5>
                    <p className="text-muted small mb-0">Overview of student counts divided by academic tracks.</p>
                  </div>
                </div>
                <div className="card-body px-3 py-4" style={{ minHeight: "280px" }}>
                  <div style={{ width: "100%", height: "240px" }}>
                    <BarChart data={barChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}