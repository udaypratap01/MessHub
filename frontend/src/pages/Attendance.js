import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";

function Attendance({ user, setIsAuthenticated, setUser }) {
  const [attendanceList, setAttendanceList] = useState([]);
  const [allAttendances, setAllAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [markingMeal, setMarkingMeal] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) fetchAllAttendance();
    else fetchMyAttendance();
  }, [user, isAdmin]);

  // 🔥 STUDENT DATA
  const fetchMyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/attendance/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttendanceList(res.data.attendances || []);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADMIN DATA
  const fetchAllAttendance = async () => {
    try {
      setAdminLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/attendance/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllAttendances(res.data.attendances || []);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setAdminLoading(false);
    }
  };

  // 🔥 MARK ATTENDANCE FUNCTION
  const handleMarkAttendance = async (mealType) => {
    try {
      setMarkingMeal(mealType);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/attendance",
        { mealType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(`${mealType} marked successfully ✅`);

      // refresh
      fetchMyAttendance();

    } catch (err) {
      setError(err.response?.data?.message || "Already marked!");
    } finally {
      setMarkingMeal(null);
    }
  };

  if (loading && !isAdmin) {
    return <Loader fullPage text="Loading..." />;
  }

  return (
    <div className="attendance-page">

      <h2 style={{ color: "#fff" }}>
        {isAdmin ? "👥 Attendance Report" : "📍 My Attendance"}
      </h2>

      {/* Messages */}
      {error && (
        <div style={{
          background: "rgba(255,0,0,0.1)",
          color: "#ff6b6b",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: "rgba(0,255,0,0.1)",
          color: "#4caf50",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          ✅ {success}
        </div>
      )}

      {/* ================= STUDENT VIEW ================= */}
      {!isAdmin && (
        <>
          {/* 🔥 MARK BUTTONS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "20px"
          }}>
            {["BREAKFAST", "LUNCH", "DINNER"].map((meal) => (
              <button
                key={meal}
                onClick={() => handleMarkAttendance(meal)}
                disabled={markingMeal === meal}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg,#6a5af9,#8f94fb)",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {markingMeal === meal ? "⏳..." : meal}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <table style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px"
          }}>
            <thead>
              <tr style={{
                background: "linear-gradient(45deg,#6a5af9,#8f94fb)",
                color: "#fff"
              }}>
                <th>Date</th>
                <th>Meal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceList.map((att, i) => (
                <tr key={att.id} style={{
                  background: i % 2 ? "rgba(0,0,0,0.2)" : "transparent"
                }}>
                  <td style={{ color: "#fff" }}>{att.date}</td>
                  <td style={{ color: "#fff" }}>{att.mealType}</td>
                  <td>
                    <span style={{
                      background: "#4caf50",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "6px"
                    }}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ================= ADMIN VIEW ================= */}
      {isAdmin && (
        <>
          {adminLoading ? <Loader /> : (
            <table style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(45deg,#6a5af9,#8f94fb)",
                  color: "#fff"
                }}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Meal</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {allAttendances.map((att, i) => (
                  <tr key={att.id} style={{
                    background: i % 2 ? "rgba(0,0,0,0.2)" : "transparent"
                  }}>
                    <td style={{ color: "#fff" }}>{att.userName}</td>
                    <td style={{ color: "#cfcfff" }}>{att.userEmail}</td>
                    <td style={{ color: "#fff" }}>{att.date}</td>
                    <td style={{ color: "#fff" }}>{att.mealType}</td>
                    <td>
                      <span style={{
                        background: "#4caf50",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "6px"
                      }}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

    </div>
  );
}

export default Attendance;