import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Building2, ArrowLeft, LayoutGrid, PlusCircle, Users,LogOut } from 'lucide-react';

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    nombre: '',
    telefono: '',
    correo: ''
  });

  useEffect(() => {
    // Al ser una vista de admin, nos aseguramos de que el token exista
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get('/api/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error("Error cargando proveedores:", err));
  }, [navigate]);

  const handleVerDetalle = (id) => {
    localStorage.setItem('selectedProviderId', id);
    navigate('/detalles-proveedor');
  };

  // Lógica de Filtrado
  const filtered = proveedores.filter(p => {
    return (
      (p.nombrecomercial?.toLowerCase() || '').includes(filters.nombre.toLowerCase()) &&
      (p.telefono?.toString() || '').includes(filters.telefono) &&
      (p.correo?.toLowerCase() || '').includes(filters.correo.toLowerCase())
    );
  });

  // Lógica de Paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filtered.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      {/* HEADER ESTILO ADMINISTRADOR - BODESA */}
      <header className="bg-[#1d3557] text-white p-4 shadow-md border-b-4 border-[#f39c12]">
        <div className="max-w-[100%] mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase leading-none">Proveedores</span>
              <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Consola de Administración</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase">
            <Link to="/nuevo-contrato" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <PlusCircle size={16} /> Nuevo Contrato
            </Link>
            <Link to="/gestion-catalogos" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <LayoutGrid size={16} /> Catálogos
            </Link>
            <Link to="/usuario" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <Users size={16} /> Usuarios
            </Link>
            <Link to="/admin" className="bg-[#f39c12]/40 px-4 py-2 rounded-md hover:bg-[#f39c12]/60 transition flex items-center gap-2 border border-white/10 text-white">
              <LogOut size={18} /> Regresar
            </Link>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-[98%] mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-[#1d3557] uppercase tracking-tight">
                Directorio de Proveedores
              </h2>
              <Search 
                size={22} 
                className="text-gray-400 cursor-pointer hover:text-[#1d3557] transition-colors" 
                onClick={() => setShowSearch(!showSearch)}
              />
            </div>
            <div className="text-xs text-gray-400 font-black uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
              {filtered.length} Registros Encontrados
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4a6b8a] text-white uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 border-r border-white/10">Nombre Comercial</th>
                  <th className="p-4 border-r border-white/10">Dirección Fiscal</th>
                  <th className="p-4 border-r border-white/10 text-center w-40">Teléfono</th>
                  <th className="p-4 text-center w-64">Correo Electrónico</th>
                </tr>
                {showSearch && (
                  <tr className="bg-gray-100 animate-in slide-in-from-top-1 duration-200">
                    <td className="p-2 border-r border-gray-200">
                      <input name="nombre" type="text" className="w-full p-1 text-[10px] border rounded" placeholder="Buscar nombre..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-200 bg-gray-200/50"></td>
                    <td className="p-2 border-r border-gray-200">
                      <input name="telefono" type="text" className="w-full p-1 text-[10px] border rounded text-center" placeholder="Buscar tel..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2">
                      <input name="correo" type="text" className="w-full p-1 text-[10px] border rounded text-center" placeholder="Buscar email..." onChange={handleFilterChange} />
                    </td>
                  </tr>
                )}
              </thead>
              <tbody className="text-[12px] text-slate-700 font-bold">
                {currentRecords.map((p) => (
                  <tr 
                    key={p.idproveedor} 
                    onClick={() => handleVerDetalle(p.idproveedor)}
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 border-r border-gray-100 text-blue-900 group-hover:underline uppercase">
                      {p.nombrecomercial}
                    </td>
                    <td className="p-4 border-r border-gray-100 text-slate-500 text-[11px]">
                      {p.direccionfiscal}
                    </td>
                    <td className="p-4 border-r border-gray-100 text-center">
                      {p.telefono}
                    </td>
                    <td className="p-4 text-center text-slate-500 italic">
                      {p.correo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación estilo Admin */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-20 transition-all">
              <ChevronLeft size={24} className="text-[#1d3557]" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-4 py-2 rounded-md font-black text-xs transition-all ${currentPage === index + 1 ? "bg-[#1d3557] text-white shadow-xl scale-110" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                  {index + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-20 transition-all">
              <ChevronRight size={24} className="text-[#1d3557]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListaProveedores;