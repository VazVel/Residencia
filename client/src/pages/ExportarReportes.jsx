import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileDown, ArrowLeft, Filter, Building2, PlusCircle, 
  LayoutGrid, Users, Download, LogOut 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ExportarReportes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [filtros, setFiltros] = useState({
    nombre: '',
    tipo: '',
    proveedor: '',
    estadoFiltro: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  const [catalogos, setCatalogos] = useState({ tipos: [], proveedores: [] });

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [resTipos, resProv] = await Promise.all([
          axios.get('/api/catcontratos'),
          axios.get('/api/proveedores')
        ]);
        setCatalogos({ tipos: resTipos.data, proveedores: resProv.data });
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };
    cargarCatalogos();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleExportar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/reportes/contratos', filtros, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_Contratos_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      {/* HEADER OFICIAL BODESA */}
      <header className="bg-[#1d3557] text-white p-4 shadow-md border-b-4 border-[#f39c12]">
        <div className="max-w-[100%] mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase leading-none">Contratos</span>
              <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Módulo de Reportes</span>
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

            <button onClick={() => navigate('/usuario')} className="bg-[#5692c8]/40 px-4 py-2 rounded-md hover:bg-[#5692c8]/60 transition flex items-center gap-2 border border-white/10">
              <Users size={16} /> Ver Usuarios
            </button>
            <button onClick={() => navigate('/admin')} className="bg-[#f39c12]/40 px-4 py-2 rounded-md hover:bg-[#f39c12]/60 transition flex items-center gap-2 border border-white/10 text-white">
              <ArrowLeft size={16} /> Volver al Dashboard
            </button>

            <button onClick={handleLogout} className="ml-4 flex items-center gap-2 text-yellow-500 hover:text-white transition-colors group">
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#1d3557] uppercase tracking-tighter">
                Generar Reportes
              </h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Configuración de exportación a Excel
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#1d3557] p-6 text-white flex items-center gap-3">
              <Filter size={24} />
              <h2 className="font-black uppercase tracking-[0.2em] text-xs">Panel de Filtros Avanzados</h2>
            </div>

            <form onSubmit={handleExportar} className="p-10 grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Palabra clave en nombre</label>
                <input type="text" name="nombre" value={filtros.nombre} onChange={handleChange} placeholder="Ej. Real Madrid, Mantenimiento..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1d3557] outline-none font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Categoría de Contrato</label>
                <select name="tipo" value={filtros.tipo} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold">
                  <option value="">Todos los tipos</option>
                  {catalogos.tipos.map(t => <option key={t.idcat} value={t.nombre_tipo}>{t.nombre_tipo}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Proveedor Específico</label>
                <select name="proveedor" value={filtros.proveedor} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold">
                  <option value="">Todos los proveedores</option>
                  {catalogos.proveedores.map(p => <option key={p.idproveedor} value={p.razonsocial}>{p.razonsocial}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Estado del Contrato</label>
                <select name="estadoFiltro" value={filtros.estadoFiltro} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-blue-800">
                  <option value="">Cualquier estado</option>
                  <option value="vigente">Vigente</option>
                  <option value="caducado">Caducado</option>
                  <option value="borrado">Borrado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Desde (Firma)</label>
                  <input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Hasta (Vencimiento)</label>
                  <input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold" />
                </div>
              </div>

              <div className="col-span-2 pt-8 border-t mt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex items-center gap-3 px-12 py-4 rounded-xl font-black uppercase text-sm tracking-widest transition-all shadow-xl ${
                    loading ? 'bg-gray-300' : 'bg-[#27ae60] hover:bg-[#2ecc71] text-white hover:-translate-y-1'
                  }`}
                >
                  {loading ? 'Procesando...' : <><FileDown size={20} /> Descargar Excel</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportarReportes;