import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Save, ShieldCheck, User, Key, IdCard, LogOut } from 'lucide-react';

const NuevoUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    nombrecompleto: '',
    rol: 2, // Por defecto: Usuario Estándar
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de seguridad básica en frontend
    if (formData.password !== formData.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    if (formData.password.length < 6) {
      return alert("La contraseña debe tener al menos 6 caracteres por seguridad");
    }

    try {
      // Enviamos solo los datos requeridos por el backend
      const { confirmPassword, ...datosAEnviar } = formData;
      await axios.post('/api/usuarios/nuevo', datosAEnviar);
      
      alert("Usuario registrado exitosamente");
      navigate('/usuario');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* HEADER ADMINISTRATIVO */}
      <header className="bg-[#1d3557] text-white p-4 shadow-md flex justify-between items-center px-8 border-b-4 border-yellow-500">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider uppercase leading-none">Alta de Personal</span>
            <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Control de Accesos</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/gestion-usuarios')}
          className="flex items-center gap-2 text-yellow-500 hover:text-white font-bold uppercase text-xs transition-all"
        >
          <LogOut size={18} /> Regresar
        </button>
      </header>

      <main className="p-10 flex justify-center">
        <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-yellow-500">
          <div className="flex items-center gap-3 mb-10 border-b pb-6">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase leading-none">Crear Nuevo Perfil</h2>
              <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">Define credenciales y privilegios</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                <IdCard size={14} /> Nombre Completo del Empleado
              </label>
              <input 
                type="text" 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-bold text-slate-700"
                placeholder="Ej. Juan Pérez García"
                onChange={(e) => setFormData({...formData, nombrecompleto: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <User size={14} /> Nombre de Usuario
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-bold text-slate-700"
                  placeholder="jperez"
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                />
              </div>

              {/* Rol */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <ShieldCheck size={14} /> Nivel de Acceso
                </label>
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-bold text-slate-700 appearance-none"
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: parseInt(e.target.value)})}
                >
                  <option value={2}>Usuario Estándar (Lectura)</option>
                  <option value={1}>Administrador (CRUD Total)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed">
              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <Key size={14} /> Contraseña
                </label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {/* Confirmar Password */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <Key size={14} /> Confirmar Contraseña
                </label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1d3557] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl flex justify-center items-center gap-3 mt-8"
            >
              <Save size={20} /> Registrar en Sistema
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NuevoUsuario;