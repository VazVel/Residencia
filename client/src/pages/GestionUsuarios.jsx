import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogOut, Search, Trash2, Edit, IdCard, User, Shield } from 'lucide-react';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false); // Estado para mostrar/ocultar filtros
  const navigate = useNavigate();

  // ESTADO PARA FILTROS
  const [filters, setFilters] = useState({
    nombre: '',
    username: '',
    rol: ''
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('/api/usuarios');
      setUsuarios(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // LÓGICA DE FILTRADO
  const filteredUsuarios = usuarios.filter(u => {
    const rolTexto = u.rol === 1 ? 'administrador' : 'usuario';
    return (
      (u.nombrecompleto?.toLowerCase() || '').includes(filters.nombre.toLowerCase()) &&
      (u.username?.toLowerCase() || '').includes(filters.username.toLowerCase()) &&
      (filters.rol === '' || rolTexto === filters.rol)
    );
  });

  const handleEliminarLogico = async (id) => {
    if (window.confirm("¿Está seguro de desactivar a este usuario?")) {
      try {
        await axios.put('/api/usuarios/eliminar', { idusuario: id });
        alert("Usuario desactivado correctamente");
        fetchUsuarios();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleEditarNavegacion = (id) => {
    localStorage.setItem('selectedUserId', id);
    navigate('/editar-usuario');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-[#1d3557] text-white p-4 shadow-md flex justify-between items-center px-8 border-b-4 border-yellow-500">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider uppercase leading-none">Gestión de Usuarios</span>
            <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Control de Accesos</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/nuevo-usuario')} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
          >
            <UserPlus size={18} /> Nuevo Usuario
          </button>
          
          <button 
            onClick={() => navigate('/admin')} 
            className="bg-[#f39c12]/40 px-4 py-2 rounded-md hover:bg-[#f39c12]/60 transition flex items-center gap-2 border border-white/10 text-white"
          >
            <LogOut size={18} /> Regresar
          </button>
        </div>
      </header>

      <main className="p-10">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-[#1d3557] uppercase tracking-tight">
                Personal Registrado
              </h2>
              <Search 
                size={22} 
                className="text-gray-400 mt-2 cursor-pointer hover:text-[#1d3557] transition-colors" 
                onClick={() => setShowSearch(!showSearch)}
              />
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest">
              {filteredUsuarios.length} Registros Encontrados
            </div>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700 text-white uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 border-r border-white/10 text-center w-20">ID</th>
                  <th className="p-4 border-r border-white/10">Nombre Completo</th>
                  <th className="p-4 border-r border-white/10">Username</th>
                  <th className="p-4 border-r border-white/10 text-center">Rol</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
                {/* FILA DE BÚSQUEDA DINÁMICA */}
                {showSearch && (
                  <tr className="bg-gray-100 animate-in fade-in duration-300">
                    <td className="p-2 border-r border-gray-200 bg-gray-200/50"></td>
                    <td className="p-2 border-r border-gray-200">
                      <input 
                        name="nombre" 
                        type="text" 
                        className="w-full p-1 text-xs border rounded outline-none focus:ring-1 focus:ring-blue-400" 
                        placeholder="Buscar nombre..." 
                        onChange={handleFilterChange} 
                      />
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      <input 
                        name="username" 
                        type="text" 
                        className="w-full p-1 text-xs border rounded outline-none focus:ring-1 focus:ring-blue-400" 
                        placeholder="Buscar @user..." 
                        onChange={handleFilterChange} 
                      />
                    </td>
                    <td className="p-2 border-r border-gray-200">
                      <select 
                        name="rol" 
                        className="w-full p-1 text-xs border rounded bg-white outline-none" 
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos</option>
                        <option value="administrador">Administrador</option>
                        <option value="usuario">Usuario</option>
                      </select>
                    </td>
                    <td className="p-2 bg-gray-200/50"></td>
                  </tr>
                )}
              </thead>
              <tbody className="text-sm text-gray-700 font-medium">
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((u) => (
                    <tr key={u.idusuario} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 border-r border-gray-100 text-center font-bold text-slate-400">{u.idusuario}</td>
                      <td className="p-4 border-r border-gray-100 font-bold text-slate-800">{u.nombrecompleto}</td>
                      <td className="p-4 border-r border-gray-100 text-blue-600 italic">@{u.username}</td>
                      <td className="p-4 border-r border-gray-100 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.rol === 1 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.rol === 1 ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-4">
                        <button 
                          onClick={() => handleEditarNavegacion(u.idusuario)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Editar Usuario"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleEliminarLogico(u.idusuario)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Desactivar Usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-400 italic">No se encontraron usuarios con esos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestionUsuarios;