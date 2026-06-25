import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { ProtectedRoute } from './components/common/index.jsx';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import FarmerDetail from './pages/FarmerDetail';
import FarmerForm from './pages/FarmerForm';
import Market from './pages/Market';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmers/add" element={<FarmerForm />} />
            <Route path="/farmers/:id" element={<FarmerDetail />} />
            <Route path="/farmers/:id/edit" element={<FarmerForm />} />
            <Route path="/market" element={<Market />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
