import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Search, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'

const Home = () => {
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
    // Al cargar, verificamos que el token exista (Protección básica de front)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get('/api/contratos')
      .then(res => setContratos(res.data))
      .catch(err => console.error("Error conectando al back:", err))
  }, [navigate])

  const handleVerContrato = (id) => {
    localStorage.setItem('selectedContractId', id);
    navigate('/ver-contrato'); 
  }

  const handleVerProveedor = (idProv) => {
    if (!idProv) return alert("ID de proveedor no encontrado");
    localStorage.setItem('selectedProviderId', idProv);
    navigate('/detalles-proveedor'); 
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  }

  // --- LÓGICA DE FILTRADO CON BORRADO LÓGICO ---
  const filteredContratos = contratos.filter(c => {
    // REGLA CRÍTICA: Excluir estado 0 (Borrado) de la vista principal
    if (c.estado === 0) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaV = new Date(c.fecha_termino);
    const estaVencido = hoy > fechaV;
    
    // Mapeo para el filtro de búsqueda
    const estadoActual = estaVencido ? 'caducado' : 'vigente';

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
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-[#4a6b8a] text-white p-4 flex justify-between items-center px-8 shadow-md">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-wider uppercase">Contratos</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="bg-[#1d3557]/30 px-4 py-2 rounded border-b-2 border-white/50 cursor-default">Contratos</span>
          <Link to="/nuevo-contrato" className="hover:text-gray-200 transition text-white">Nuevo contrato</Link>
          
          <Search 
            size={20} 
            className="cursor-pointer text-gray-200 hover:text-white transition-colors" 
            onClick={() => setShowSearch(!showSearch)} 
          />

          <button 
            onClick={handleLogout}
            className="ml-4 p-2 hover:bg-red-500/20 rounded-full transition-colors group"
            title="Cerrar Sesión"
          >
            <LogOut size={20} className="text-gray-200 group-hover:text-white" />
          </button>
        </div>
      </header>

      <main className="p-10">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#1d3557] border-b-4 border-[#1d3557] pb-1 uppercase">
                Tabla de contratos
              </h2>
              <Search size={22} className="text-gray-400 mt-2 cursor-pointer hover:text-[#1d3557]" onClick={() => setShowSearch(!showSearch)} />
            </div>
            <div className="text-sm text-gray-500 font-semibold italic">
              Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredContratos.length)} de {filteredContratos.length} registros
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#5692c8] text-white uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-4 border-r border-white/30 text-center w-16">ID</th>
                  <th className="p-4 border-r border-white/30">Nombre</th>
                  <th className="p-4 border-r border-white/30">Tipo</th>
                  <th className="p-4 border-r border-white/30 text-center">Firma</th>
                  <th className="p-4 border-r border-white/30 text-center">Término</th>
                  <th className="p-4 border-r border-white/30 text-center">Estado</th>
                  <th className="p-4 border-r border-white/30 text-center">Proveedor</th>
                  <th className="p-4 text-center">Costo</th>
                </tr>
                {showSearch && (
                  <tr className="bg-gray-200 animate-in fade-in duration-300">
                    <td className="p-2 border-r border-gray-300">
                      <input name="id" type="text" className="w-full p-1 text-xs border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="nombre" type="text" className="w-full p-1 text-xs border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="tipo" type="text" className="w-full p-1 text-xs border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="fechaFirmaDesde" type="date" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="fechaTerminoHasta" type="date" className="w-full p-1 text-[10px] border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <select name="estadoFiltro" className="w-full p-1 text-xs border rounded bg-white" onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="vigente">Vigente</option>
                        <option value="caducado">Caducado</option>
                      </select>
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="proveedor" type="text" className="w-full p-1 text-xs border rounded" onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 text-center">
                      <input name="costo" type="text" className="w-full p-1 text-xs border rounded text-center" onChange={handleFilterChange} />
                    </td>
                  </tr>
                )}
              </thead>
              <tbody className="text-sm text-gray-700 font-medium">
                {currentRecords.map((c) => (
                  <tr key={c.id} className="border-b border-gray-200 hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-gray-200 text-center font-bold bg-gray-50/50 text-slate-400">{c.id}</td>
                    <td className="p-4 border-r border-gray-200 text-blue-700 hover:underline cursor-pointer font-bold" onClick={() => handleVerContrato(c.id)}>
                      {c.nombre}
                    </td>
                    <td className="p-4 border-r border-gray-200">{c.tipo}</td>
                    <td className="p-4 border-r border-gray-200 text-center">
                      {c.fecha_firma ? new Date(c.fecha_firma).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 border-r border-gray-200 text-center">
                      {c.fecha_termino ? new Date(c.fecha_termino).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 border-r border-gray-200 text-center">
                      {(() => {
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0); 
                        const fechaVencimiento = new Date(c.fecha_termino);
                        const estaVencido = hoy > fechaVencimiento;
                        return (
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${estaVencido ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {estaVencido ? 'Caducado' : 'Vigente'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 border-r border-gray-200 text-center text-[#4a6b8a] hover:underline cursor-pointer font-bold" onClick={() => handleVerProveedor(c.idproveedor)}>
                      {c.proveedor}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-900">
                      ${Number(c.costo).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-all">
              <ChevronLeft size={24} className="text-[#1d3557]" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-4 py-2 rounded-md font-bold transition-all ${currentPage === index + 1 ? "bg-[#4a6b8a] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {index + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-all">
              <ChevronRight size={24} className="text-[#1d3557]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home;