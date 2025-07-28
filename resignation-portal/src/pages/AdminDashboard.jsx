import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchResignations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/resignations`, {
          headers: { Authorization: token },
        });
        const data = await res.json();
        if (res.ok) {
          setResignations(data.data);
        } else {
          setError(data.message || "Failed to fetch");
        }
      } catch (e) {
        setError("Network error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchResignations();
  }, [token,API_URL]);

  const handleApproval = async (resignationId, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/conclude_resignation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          resignationId,
          status: action, // 'approved' or 'rejected'
          lwd: new Date().toISOString().split("T")[0], // today for now
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Resignation ${action} successfully`);
        // Refresh list
        setResignations((prev) =>
          prev.map((r) =>
            r._id === resignationId ? { ...r, status: action } : r
          )
        );
      } else {
        alert(data.message || "Action failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  useEffect(() => {
    const fetchResponses = async () => {
      const res = await fetch(`${API_URL}/api/admin/exit_responses`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();
      if (res.ok) {
        setData(json.data);
      } else {
        alert("Failed to load exit responses");
      }
    };

    fetchResponses();
  }, [API_URL]);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Resignations</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {resignations.map((r) => (
        <div key={r._id} className="border p-4 rounded shadow bg-white mb-4">
          <p>
            <strong>ID:</strong> {r._id}
          </p>
          <p>
            <strong>Employee ID:</strong> {r.employeeId?.username || "Employee"}
          </p>
          <p>
            <strong>LWD:</strong> {r.lwd || "Not set"}
          </p>
          <p>
            <strong>Status:</strong> {r.status}
          </p>

          {r.status === "pending" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleApproval(r._id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(r._id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      <div>
        <h1 className="text-xl font-bold mb-4">Exit Interview Responses</h1>
        {data.map((record, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded">
            <p className="font-semibold">
              Employee ID: {record.employeeId._id}
            </p>
            {record.responses.map((r, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{r.questionText}</p>
                <p className="text-gray-800">{r.response}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
