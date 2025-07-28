import { useState } from "react";

export default function EmployeeDashboard() {
  const [lwd, setLwd] = useState("");

  const [responses, setResponses] = useState([
    { questionText: "Why are you leaving?", response: "" },
    { questionText: "Any suggestions for improvement?", response: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(() => {
    return localStorage.getItem("exitSubmitted") === "true";
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const submitResignation = async () => {
    const res = await fetch(`${API_URL}/api/user/resign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ lwd }),
    });

    const data = await res.json();
    if (res.ok) alert("Resignation submitted");
    else alert(data.message || "Error submitting resignation");
  };

  const submitResponses = async () => {
    const res = await fetch(`${API_URL}/api/user/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ responses }),
    });

    if (res.ok) {
      alert("Responses submitted.");
      setSubmitted(true);
      localStorage.setItem("exitSubmitted", "true");
    } else {
      alert("Submission failed.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employee Dashboard</h1>
      <input
        type="date"
        className="border p-2 mr-2"
        onChange={(e) => setLwd(e.target.value)}
      />
      <button
        className="bg-red-600 text-white px-4 py-2"
        onClick={submitResignation}
      >
        Submit Resignation
      </button>

      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Exit Interview</h1>
        {responses.map((q, idx) => (
          <div key={idx} className="mb-4">
            <p className="mb-1">{q.questionText}</p>
            <input
              className="border p-2 w-full"
              value={q.response}
              onChange={(e) => {
                const updated = [...responses];
                updated[idx].response = e.target.value;
                setResponses(updated);
              }}
            />
          </div>
        ))}
        <button
          onClick={submitResponses}
          className="bg-blue-600 text-white px-4 py-2"
          disabled={submitted}
        >
          {loading ? "Submitting..." : "Submit Interview"}
        </button>
      </div>
    </div>
  );
}
