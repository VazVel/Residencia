import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya existe un token, redirigimos automáticamente para no pedir login de nuevo
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('userRole');
    if (token) {
      if (rol === "1") navigate('/admin');
      else navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', credentials);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.rol);
      localStorage.setItem('userName', res.data.user.nombre);

      if (res.data.user.rol === 1) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-[#1d3557] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-[#f39c12]">
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <img src="/bodesa.png" alt="Bodesa" className="h-16 mb-4 object-contain" />
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter text-center">Gestión de Contratos</h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Acceso de Personal</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={20} />
              <p className="text-xs text-red-700 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold transition-all"
                placeholder="Nombre de usuario"
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold transition-all"
                placeholder="Contraseña"
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1d3557] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl flex justify-center items-center gap-3 mt-4"
            >
              <LogIn size={20} /> Autenticar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;