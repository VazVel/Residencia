import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import AgregarContrato from './pages/AgregarContrato'
import DetallesContrato from './pages/detallesContrato'

// --- COMPONENTE HOME ---
const Home = () => {
  const [contratos, setContratos] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate(); // Ahora sí funcionará correctamente

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 25

  const [filters, setFilters] = useState({
    id: '',
    nombre: '',
    tipo: '',
    proveedor: '',
    costo: ''
  })

  useEffect(() => {
    axios.get('/api/contratos')
      .then(res => setContratos(res.data))
      .catch(err => console.error("Error conectando al back:", err))
  }, [])

  const handleVerDetalle = (id) => {
    localStorage.setItem('selectedContractId', id);
    navigate('/ver-contrato'); 
  }

  const filteredContratos = contratos.filter(c => {
    return (
      c.id.toString().includes(filters.id) &&
      c.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
      c.tipo.toLowerCase().includes(filters.tipo.toLowerCase()) &&
      c.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase()) &&
      c.costo.toString().includes(filters.costo)
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#4a6b8a] text-white p-4 flex justify-between items-center px-8 shadow-md">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-wider uppercase">Contratos</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="bg-[#1d3557]/30 px-4 py-2 rounded border-b-2 border-white/50 cursor-default">Contratos</span>
          <Link to="/nuevo-contrato" className="hover:text-gray-200 transition">Nuevo contrato</Link>
          <Search 
            size={20} 
            className="cursor-pointer text-gray-200 hover:text-white" 
            onClick={() => setShowSearch(!showSearch)} 
          />
        </div>
      </header>

      <main className="p-10">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#1d3557] border-b-4 border-[#1d3557] pb-1">
                Tabla de contratos
              </h2>
              <Search 
                size={22} 
                className="text-gray-400 mt-2 cursor-pointer hover:text-[#1d3557]" 
                onClick={() => setShowSearch(!showSearch)}
              />
            </div>
            <div className="text-sm text-gray-500 font-semibold italic">
              Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredContratos.length)} de {filteredContratos.length} registros
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#5692c8] text-white uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 border-r border-white/30 text-center w-16">ID</th>
                  <th className="p-4 border-r border-white/30">Nombre</th>
                  <th className="p-4 border-r border-white/30">Tipo</th>
                  <th className="p-4 border-r border-white/30">Fecha de firma</th>
                  <th className="p-4 border-r border-white/30">Fecha de termino</th>
                  <th className="p-4 border-r border-white/30">Estado</th>
                  <th className="p-4 border-r border-white/30 text-center">Proveedor</th>
                  <th className="p-4 text-center">Costo</th>
                </tr>
                {showSearch && (
                  <tr className="bg-gray-200">
                    <td className="p-2 border-r border-gray-300">
                      <input name="id" type="text" className="w-full p-1 text-xs border rounded" placeholder="Filtrar..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="nombre" type="text" className="w-full p-1 text-xs border rounded" placeholder="Filtrar..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="tipo" type="text" className="w-full p-1 text-xs border rounded" placeholder="Filtrar..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 border-r border-gray-300 bg-gray-300/50"></td>
                    <td className="p-2 border-r border-gray-300 bg-gray-300/50"></td>
                    <td className="p-2 border-r border-gray-300 bg-gray-300/50"></td>
                    <td className="p-2 border-r border-gray-300">
                      <input name="proveedor" type="text" className="w-full p-1 text-xs border rounded" placeholder="Filtrar..." onChange={handleFilterChange} />
                    </td>
                    <td className="p-2 text-center">
                      <input name="costo" type="text" className="w-full p-1 text-xs border rounded text-center" placeholder="Filtrar..." onChange={handleFilterChange} />
                    </td>
                  </tr>
                )}
              </thead>
              <tbody className="text-sm text-gray-700 font-medium">
                {currentRecords.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => handleVerDetalle(c.id)}
                    className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 border-r border-gray-200 text-center font-bold bg-gray-50/50">{c.id}</td>
                    <td className="p-4 border-r border-gray-200">{c.nombre}</td>
                    <td className="p-4 border-r border-gray-200">{c.tipo}</td>
                    <td className="p-4 border-r border-gray-200">
                      {c.fecha_firma ? new Date(c.fecha_firma).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {c.fecha_termino ? new Date(c.fecha_termino).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {(() => {
                        const hoy = new Date();
                        // Ponemos las horas a 0 para comparar solo el día
                        hoy.setHours(0, 0, 0, 0); 
                        
                        const fechaVencimiento = new Date(c.fecha_termino);
                        
                        // Si la fecha actual es mayor a la de término, está caducado
                        const estaVencido = hoy > fechaVencimiento;

                        return (
                          <span className={`font-bold ${estaVencido ? "text-red-600" : "text-green-600"}`}>
                            {estaVencido ? 'Caducado' : 'Vigente'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 border-r border-gray-200 text-center">{c.proveedor}</td>
                    <td className="p-4 text-center font-bold text-slate-900">
                      ${Number(c.costo).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30">
              <ChevronLeft size={24} className="text-[#1d3557]" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-4 py-2 rounded-md font-bold ${currentPage === index + 1 ? "bg-[#4a6b8a] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {index + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30">
              <ChevronRight size={24} className="text-[#1d3557]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuevo-contrato" element={<AgregarContrato />} />
        <Route path="/ver-contrato" element={<DetallesContrato />} />
      </Routes>
    </Router>
  )
}

export default App