import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('userRole');
    if (token && !error) {
      if (rol === "1") navigate('/admin');
      else navigate('/home');
    }
  }, [navigate, error]);

  // Función de autenticación pura
  const ejecutarLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Nota: Asegúrate de que la ruta sea /api/auth/login
      const res = await axios.post('/api/auth/login', credentials);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.rol.toString());
      localStorage.setItem('userName', res.data.user.nombre);

      if (parseInt(res.data.user.rol) === 1) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      localStorage.clear();
      console.error("Error capturado:", err);
      
      // Forzamos el error al estado
      const mensaje = err.response?.data?.error || "Credenciales inválidas";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Manejador de tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      ejecutarLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#1d3557] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-[#f39c12]">
        <div className="p-10 text-center">
          <img src="/bodesa.png" alt="Bodesa" className="h-16 mb-4 mx-auto object-contain" />
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestión de Contratos</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Acceso de Personal</p>

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-left animate-in fade-in zoom-in duration-300">
              <ShieldAlert className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-xs text-red-700 font-bold">{error}</p>
            </div>
          )}

          {/* QUITAMOS EL <form> PARA EVITAR RECARGAS DEL NAVEGADOR */}
          <div className="mt-8 space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold"
                placeholder="Nombre de usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-bold"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* BOTÓN TIPO BUTTON (NO SUBMIT) */}
            <button 
              type="button" 
              disabled={loading}
              onClick={ejecutarLogin}
              className={`w-full bg-[#1d3557] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl flex justify-center items-center gap-3 ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-slate-800 hover:scale-[1.02]'}`}
            >
              <LogIn size={20} /> 
              {loading ? 'Verificando...' : 'Autenticar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;