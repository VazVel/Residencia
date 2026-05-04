import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Search, ChevronLeft, ChevronRight, Users, Download, ArrowLeft, Building2, PlusCircle, LayoutGrid, LogOut } from 'lucide-react'

const AdminDashboard = () => {
  const [contratos, setContratos] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 25

  const [filters, setFilters] = useState({
    id: '', nombre: '', tipo: '', proveedor: '', costo: '',
    fechaFirmaDesde: '', fechaTerminoHasta: '', estadoFiltro: '' 
  })

  useEffect(() => {
    axios.get('/api/contratos/all')
      .then(res => setContratos(res.data))
      .catch(err => console.error("Error cargando consola maestra:", err))
  }, [])

  // Función para redirigir a los detalles del contrato
  const handleVerContrato = (id) => {
    localStorage.setItem('selectedContractId', id);
    navigate('/ver-contrato'); 
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  }

  const filteredContratos = contratos.filter(c => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaV = new Date(c.fecha_termino);
    
    let estadoActual = '';
    if (c.estado === 0) estadoActual = 'borrado';
    else if (hoy > fechaV) estadoActual = 'caducado';
    else estadoActual = 'vigente';

    const fechaFirmaContrato = new Date(c.fecha_firma);
    const filtroDesde = filters.fechaFirmaDesde ? new Date(filters.fechaFirmaDesde) : null;
    const filtroHasta = filters.fechaTerminoHasta ? new Date(filters.fechaTerminoHasta) : null;

    return (
      c.id.toString().includes(filters.id) &&
      c.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
      c.tipo.toLowerCase().includes(filters.tipo.toLowerCase()) &&
      c.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase()) &&
      c.costo.toString().includes(filters.costo) &&
      (filters.estadoFiltro === '' || estadoActual === filters.estadoFiltro) &&
      (!filtroDesde || fechaFirmaContrato >= filtroDesde) &&
      (!filtroHasta || fechaV <= filtroHasta)
    )
  })

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredContratos.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredContratos.length / recordsPerPage)

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      <header className="bg-[#1d3557] text-white p-4 shadow-md border-b-4 border-[#f39c12]">
        <div className="max-w-[100%] mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase leading-none">Contratos</span>
              <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Consola de Administración</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase">
            <Link to="/proveedores" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <Building2 size={16} /> Proveedores
            </Link>
            <Link to="/nuevo-contrato" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <PlusCircle size={16} /> Nuevo Contrato
            </Link>
            <Link to="/gestion-catalogos" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <LayoutGrid size={16} /> Catálogos
            </Link>

            <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

            <button 
              onClick={() => navigate('/usuario')}
              className="bg-[#5692c8]/40 px-4 py-2 rounded-md hover:bg-[#5692c8]/60 transition flex items-center gap-2 border border-white/10"
            >
              <Users size={16} /> Ver Usuarios
            </button>
            <button 
              onClick={() => navigate('/exportar-reportes')}
              className="bg-[#27ae60]/40 px-4 py-2 rounded-md hover:bg-[#27ae60]/60 transition flex items-center gap-2 border border-white/10"
            >
              <Download size={16} /> Exportar Datos
            </button>

            <button 
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2 text-yellow-500 hover:text-white transition-colors group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-[98%] mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-[#1d3557] uppercase tracking-tight">
                Listado Maestro de Contratos
              </h2>
              <Search 
                size={22} 
                className="text-gray-400 cursor-pointer hover:text-[#1d3557] transition-colors" 
                onClick={() => setShowSearch(!showSearch)}
              />
            </div>
            <div className="text-xs text-gray-400 font-black uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
              {filteredContratos.length} Registros Totales
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4a6b8a] text-white uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4 border-r border-white/10 text-center w-16">ID</th>
                  <th className="p-4 border-r border-white/10">Nombre</th>
                  <th className="p-4 border-r border-white/10 w-40">Tipo</th>
                  <th className="p-4 border-r border-white/10 text-center w-32">Firma</th>
                  <th className="p-4 border-r border-white/10 text-center w-32">Vencimiento</th>
                  <th className="p-4 border-r border-white/10 text-center w-32">Estado Real</th>
                  <th className="p-4 border-r border-white/10 text-center">Proveedor</th>
                  <th className="p-4 text-center w-32">Costo (MXN)</th>
                </tr>
                {showSearch && (
                   <tr className="bg-gray-100 animate-in slide-in-from-top-1 duration-200">
                    <td className="p-2 border-r border-gray-200"><input name="id" type="text" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2 border-r border-gray-200"><input name="nombre" type="text" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2 border-r border-gray-200"><input name="tipo" type="text" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2 border-r border-gray-200"><input name="fechaFirmaDesde" type="date" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2 border-r border-gray-200"><input name="fechaTerminoHasta" type="date" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2 border-r border-gray-200">
                      <select name="estadoFiltro" className="w-full p-1 text-[10px] border rounded bg-white" onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="vigente">Vigente</option>
                        <option value="caducado">Caducado</option>
                        <option value="borrado">Borrado</option>
                      </select>
                    </td>
                    <td className="p-2 border-r border-gray-200"><input name="proveedor" type="text" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                    <td className="p-2"><input name="costo" type="text" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} /></td>
                  </tr>
                )}
              </thead>
              <tbody className="text-[12px] text-slate-700 font-bold">
                {currentRecords.map((c) => (
                  <tr key={c.id} className={`border-b border-gray-100 transition-colors ${c.estado === 0 ? 'bg-red-50/50 italic opacity-80' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-4 border-r border-gray-100 text-center text-slate-400">{c.id}</td>
                    
                    {/* SOLUCIÓN AL BUG: Nombre con link para navegar al detalle */}
                    <td 
                      className="p-4 border-r border-gray-100 text-blue-900 cursor-pointer hover:underline"
                      onClick={() => handleVerContrato(c.id)}
                    >
                      {c.nombre}
                    </td>

                    <td className="p-4 border-r border-gray-100 uppercase text-[10px]">{c.tipo}</td>
                    <td className="p-4 border-r border-gray-100 text-center">{c.fecha_firma ? new Date(c.fecha_firma).toLocaleDateString() : '-'}</td>
                    <td className="p-4 border-r border-gray-100 text-center">{c.fecha_termino ? new Date(c.fecha_termino).toLocaleDateString() : '-'}</td>
                    <td className="p-4 border-r border-gray-100 text-center">
                      {(() => {
                        if (c.estado === 0) return <span className="text-gray-400 bg-gray-200 px-2 py-1 rounded text-[9px] uppercase font-black">Eliminado</span>;
                        const hoy = new Date(); hoy.setHours(0, 0, 0, 0); 
                        const vencido = hoy > new Date(c.fecha_termino);
                        return (
                          <span className={`px-2 py-1 rounded text-[9px] uppercase font-black ${vencido ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}>
                            {vencido ? 'Caducado' : 'Vigente'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 border-r border-gray-100 text-center">{c.proveedor}</td>
                    <td className="p-4 text-center font-black text-slate-900">
                      ${Number(c.costo).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
  )
}

export default AdminDashboard