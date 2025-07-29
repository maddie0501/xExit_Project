import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // console.log(API_URL)

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data, form);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // store actual role

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-4"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
