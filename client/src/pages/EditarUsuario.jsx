import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, ShieldCheck, User, IdCard, Key, RefreshCcw } from 'lucide-react';

const EditarUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    idusuario: '',
    username: '',
    nombrecompleto: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const idGuardado = localStorage.getItem('selectedUserId');
    if (!idGuardado) {
      alert("No se seleccionó ningún usuario");
      navigate('/usuario');
      return;
    }

    const fetchUsuario = async () => {
      try {
        // Usamos un endpoint de detalle (puedes reutilizar el de lista o crear uno específico)
        const res = await axios.get('/api/usuarios');
        const usuarioActual = res.data.find(u => u.idusuario === parseInt(idGuardado));
        
        if (usuarioActual) {
          setFormData({
            ...formData,
            idusuario: usuarioActual.idusuario,
            username: usuarioActual.username,
            nombrecompleto: usuarioActual.nombrecompleto,
            rol: usuarioActual.rol,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return alert("Las contraseñas nuevas no coinciden");
    }

    try {
      const { confirmPassword, ...datosAEnviar } = formData;
      await axios.put('/api/usuarios/actualizar', datosAEnviar);
      alert("Usuario actualizado correctamente");
      navigate('/usuario');
    } catch (error) {
      alert("Error al actualizar el usuario");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Cargando datos del personal...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-[#1d3557] text-white p-4 shadow-md flex justify-between items-center px-8 border-b-4 border-yellow-500">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <span className="text-xl font-black uppercase tracking-wider">Modificar Usuario</span>
        </div>
        <button onClick={() => navigate('/usuario')} className="flex items-center gap-2 text-yellow-500 hover:text-white font-bold uppercase text-xs">
          <ArrowLeft size={18} /> Cancelar
        </button>
      </header>

      <main className="p-10 flex justify-center">
        <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-blue-600">
          <div className="flex items-center gap-3 mb-10 border-b pb-6">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <RefreshCcw size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase leading-none">Perfil: {formData.username}</h2>
              <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">Actualización de credenciales</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                <IdCard size={14} /> Nombre Completo
              </label>
              <input 
                type="text" 
                value={formData.nombrecompleto}
                className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                onChange={(e) => setFormData({...formData, nombrecompleto: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <User size={14} /> Username
                </label>
                <input 
                  type="text" 
                  value={formData.username}
                  className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <ShieldCheck size={14} /> Rol en Sistema
                </label>
                <select 
                  className="w-full p-4 bg-pink-50/30 border border-pink-100 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: parseInt(e.target.value)})}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Usuario</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
              <p className="text-[10px] text-yellow-700 font-bold uppercase">Aviso de Seguridad</p>
              <p className="text-xs text-yellow-800">Deje los campos de contraseña en blanco si no desea cambiarla.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <Key size={14} /> Nueva Contraseña
                </label>
                <input 
                  type="password" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <Key size={14} /> Confirmar
                </label>
                <input 
                  type="password" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1d3557] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 shadow-xl flex justify-center items-center gap-3">
              <Save size={20} /> Guardar Cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarUsuario;