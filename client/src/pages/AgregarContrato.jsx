import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilePlus, Save, ArrowLeft, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgregarContrato = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    idtipo: '',
    idproveedor: '',
    fechainicio: '',
    fechatermino: '',
    costo: 0,
    renovado: false,
    asistencia: '',
    descripcion: '',
    estado: 1
  });

  const [catalogos, setCatalogos] = useState({ tipos: [], proveedores: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTipos, resProv] = await Promise.all([
          axios.get('/api/catcontratos'),
          axios.get('/api/proveedores')
        ]);
        
        setCatalogos({ 
          tipos: Array.isArray(resTipos.data) ? resTipos.data : [], 
          proveedores: Array.isArray(resProv.data) ? resProv.data : [] 
        });
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contratos/nuevo', formData);
      alert("Contrato guardado con éxito");
      navigate('/');
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER PROFESIONAL BODESA */}
      <header className="bg-[#4a6b8a] text-white p-4 shadow-md flex justify-between items-center px-8">
        <div className="flex items-center gap-6">
          <img 
            src="/bodesa.png" 
            alt="Bodesa" 
            className="h-10 w-auto object-contain" 
          />
          <span className="text-xl font-bold tracking-wider">CONTRATOS</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="font-semibold cursor-pointer hover:text-gray-200" onClick={() => navigate('/')}>Contratos</span>
          <span className="font-bold bg-[#1d3557]/30 px-4 py-2 rounded cursor-default">Nuevo contrato</span>
          <Search size={20} className="cursor-pointer text-gray-200 hover:text-white" />
        </div>
      </header>

      {/* CUERPO DE LA PANTALLA */}
      <main className="p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-slate-800">Registro</h1>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition font-bold"
            >
              <ArrowLeft size={20} /> Volver
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-2xl">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <FilePlus className="text-[#4a6b8a]" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Añadir nuevo contrato</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-10 gap-y-6">
              {/* Nombre: Límite 100 caracteres */}
              <div className="col-span-1">
                <label className="block text-sm font-bold mb-1 text-gray-700">
                  <span className="text-red-500">*</span>Nombre del contrato
                </label>
                <input 
                  type="text" 
                  maxLength={100}
                  placeholder="Máx. 100 caracteres"
                  className="w-full p-2 bg-pink-50/50 rounded border border-pink-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required 
                />
              </div>

              {/* Periodo Activo */}
              <div className="col-span-1 flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold mb-1 text-gray-700"><span className="text-red-500">*</span>Inicio</label>
                  <input type="date" className="w-full p-2 bg-pink-50/50 rounded border border-pink-100" onChange={(e) => setFormData({...formData, fechainicio: e.target.value})} required />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold mb-1 text-gray-700"><span className="text-red-500">*</span>Término</label>
                  <input type="date" className="w-full p-2 bg-pink-50/50 rounded border border-pink-100" onChange={(e) => setFormData({...formData, fechatermino: e.target.value})} required />
                </div>
              </div>

              {/* Tipo de Contrato */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700"><span className="text-red-500">*</span>Tipo de contrato</label>
                <select 
                  className="w-full p-2 bg-pink-50/50 rounded border border-pink-100 outline-none"
                  onChange={(e) => setFormData({...formData, idtipo: e.target.value})}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {catalogos.tipos?.map(t => (
                    <option key={t.idcat} value={t.idcat}>{t.nombre_tipo}</option>
                  ))}
                </select>
              </div>

              {/* Renovado */}
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  onChange={(e) => setFormData({...formData, renovado: e.target.checked})} 
                />
                <label className="text-sm font-bold text-gray-700">¿Contrato renovado?</label>
              </div>

              {/* Proveedor */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700"><span className="text-red-500">*</span>Proveedor</label>
                <select 
                  className="w-full p-2 bg-pink-50/50 rounded border border-pink-100 outline-none"
                  onChange={(e) => setFormData({...formData, idproveedor: e.target.value})}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {catalogos.proveedores?.map(p => (
                    <option key={p.idproveedor} value={p.idproveedor}>{p.razonsocial}</option>
                  ))}
                </select>
              </div>

              {/* Asistencia: Límite 200 caracteres */}
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Asistencia</label>
                <input 
                  type="text" 
                  maxLength={200}
                  placeholder="Máx. 200 caracteres"
                  className="w-full p-2 bg-pink-50/50 rounded border border-pink-100" 
                  onChange={(e) => setFormData({...formData, asistencia: e.target.value})} 
                />
              </div>

              {/* Costo */}
              <div className="col-span-1">
                <label className="block text-sm font-bold mb-1 text-gray-700">Costo (si existe)</label>
                <input type="number" className="w-full p-2 bg-pink-50/50 rounded border border-pink-100" onChange={(e) => setFormData({...formData, costo: e.target.value})} />
              </div>

              {/* Descripción: Límite 200 caracteres */}
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1 text-gray-700">Descripción</label>
                <textarea 
                  rows="4" 
                  maxLength={200}
                  placeholder="Máx. 200 caracteres"
                  className="w-full p-2 bg-pink-50/50 rounded border border-pink-100 focus:ring-1 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
                {/* Contador visual opcional (Ingeniería de detalle) */}
                <p className="text-right text-xs text-gray-400 mt-1">
                  {formData.descripcion.length}/200
                </p>
              </div>

              <div className="col-span-2 flex justify-center mt-6">
                <button type="submit" className="bg-[#4a6b8a] text-white px-16 py-3 rounded-full hover:bg-[#34506d] shadow-lg transition-all flex items-center gap-2 font-bold tracking-widest uppercase">
                  <Save size={20} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgregarContrato;