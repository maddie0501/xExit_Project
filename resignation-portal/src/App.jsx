import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './app.css'


function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <>

     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
      {token && role === 'employee' && (
        <Route path="/employee" element={<EmployeeDashboard />} />
      )}
      {token && role === 'admin' && (
        <Route path="/admin" element={<AdminDashboard />} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
   
  );
}

export default App;
