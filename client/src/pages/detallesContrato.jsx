import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Edit3, ArrowLeft, Search, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DetallesContrato = () => {
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

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
    estado: true
  });

  const [catalogos, setCatalogos] = useState({ tipos: [], proveedores: [] });

  useEffect(() => {
    const idGuardado = localStorage.getItem('selectedContractId');
    
    if (!idGuardado) {
      alert("No se seleccionó ningún contrato");
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [resContrato, resTipos, resProv] = await Promise.all([
          axios.post('/api/contratos/detalle', { idcontrato: idGuardado }),
          axios.get('/api/catcontratos'),
          axios.get('/api/proveedores')
        ]);
        
        // --- INGENIERÍA DE DATOS: LIMPIEZA DE NULLS Y FECHAS ---
        const d = resContrato.data;
        const contratoLimpiado = {
          ...d,
          nombre: d.nombre || '',
          asistencia: d.asistencia || '', // Evita que el null rompa el input
          descripcion: d.descripcion || '', // Evita que el null rompa el textarea
          fechainicio: d.fechainicio ? d.fechainicio.split('T')[0] : '',
          fechatermino: d.fechatermino ? d.fechatermino.split('T')[0] : '',
          costo: d.costo || 0,
          idtipo: d.idtipo || '',
          idproveedor: d.idproveedor || ''
        };

        setFormData(contratoLimpiado);
        setCatalogos({ 
          tipos: Array.isArray(resTipos.data) ? resTipos.data : [], 
          proveedores: Array.isArray(resProv.data) ? resProv.data : [] 
        });
        setLoading(false);
      } catch (error) {
        console.error("Error recuperando información:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const idGuardado = localStorage.getItem('selectedContractId');
    
    try {
      // Creamos un objeto que incluya el ID para que el backend sepa qué editar
      const dataParaEnviar = {
        ...formData,
        idcontrato: idGuardado
      };

      // La URL ahora es limpia y no expone el ID
      await axios.put('/api/contratos/actualizar', dataParaEnviar);
      
      alert("Contrato actualizado exitosamente");
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al guardar los cambios");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Cargando datos del contrato...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#4a6b8a] text-white p-4 shadow-md flex justify-between items-center px-8">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-wider uppercase">Contratos</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/')}>Contratos</span>
          <span className="bg-[#1d3557]/30 px-4 py-2 rounded border-b-2 border-white/50">Detalles</span>
          <Search size={20} className="cursor-pointer text-gray-200" />
        </div>
      </header>

      <main className="p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-slate-800">
              {editando ? 'Modificar Registro' : 'Visualización de Registro'}
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition font-bold"
            >
              <ArrowLeft size={20} /> Volver
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-2xl">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <FileText className="text-[#4a6b8a]" size={24} />
              <h2 className="text-xl font-bold text-gray-800">
                {editando ? 'Editar información del contrato' : 'Datos generales del contrato'}
              </h2>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-10 gap-y-6">
              <div className="col-span-1">
                <label className="block text-sm font-bold mb-1 text-gray-700">Nombre del contrato</label>
                <input 
                  type="text" 
                  maxLength={100}
                  disabled={!editando}
                  className={`w-full p-2 rounded border focus:outline-none transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-1 focus:ring-blue-400' : 'bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500'}`}
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="col-span-1 flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Inicio</label>
                  <input 
                    type="date" 
                    disabled={!editando}
                    className={`w-full p-2 rounded border ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    value={formData.fechainicio} 
                    onChange={(e) => setFormData({...formData, fechainicio: e.target.value})}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Término</label>
                  <input 
                    type="date" 
                    disabled={!editando}
                    className={`w-full p-2 rounded border ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    value={formData.fechatermino}
                    onChange={(e) => setFormData({...formData, fechatermino: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Tipo de contrato</label>
                <select 
                  disabled={!editando}
                  className={`w-full p-2 rounded border outline-none ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                  value={formData.idtipo}
                  onChange={(e) => setFormData({...formData, idtipo: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  {catalogos.tipos?.map(t => (
                    <option key={t.idcat} value={t.idcat}>{t.nombre_tipo}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  disabled={!editando}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer disabled:cursor-not-allowed"
                  checked={formData.renovado}
                  onChange={(e) => setFormData({...formData, renovado: e.target.checked})} 
                />
                <label className="text-sm font-bold text-slate-700">¿Contrato renovado?</label>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Proveedor</label>
                <select 
                  disabled={!editando}
                  className={`w-full p-2 rounded border outline-none ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                  value={formData.idproveedor}
                  onChange={(e) => setFormData({...formData, idproveedor: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  {catalogos.proveedores?.map(p => (
                    <option key={p.idproveedor} value={p.idproveedor}>{p.razonsocial}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Asistencia</label>
                <input 
                  type="text" 
                  maxLength={200}
                  disabled={!editando}
                  className={`w-full p-2 rounded border ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`} 
                  value={formData.asistencia}
                  onChange={(e) => setFormData({...formData, asistencia: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Costo</label>
                <input 
                  type="number" 
                  disabled={!editando}
                  className={`w-full p-2 rounded border ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                  value={formData.costo}
                  onChange={(e) => setFormData({...formData, costo: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1 text-gray-700">Descripción</label>
                <textarea 
                  rows="4" 
                  maxLength={200}
                  disabled={!editando}
                  className={`w-full p-2 rounded border focus:ring-1 focus:ring-blue-400 outline-none ${editando ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
                <p className="text-right text-xs text-gray-400 mt-1">
                  {formData.descripcion.length}/200
                </p>
              </div>


                <div className="col-span-2 flex justify-center mt-6 gap-4">
                {editando ? (
                    <>
                    {/* Botón de Cancelar: Muy importante para la experiencia de usuario (UX) */}
                    <button 
                        type="button"
                        onClick={() => setEditando(false)}
                        className="bg-gray-400 text-white px-8 py-3 rounded-full hover:bg-gray-500 shadow-md transition-all font-bold uppercase tracking-widest"
                    >
                        Cancelar
                    </button>

                    {/* Botón de Guardar: Es el ÚNICO que debe ser type="submit" */}
                    <button 
                        type="submit" 
                        className="bg-green-600 text-white px-12 py-3 rounded-full hover:bg-green-700 shadow-lg transition-all flex items-center gap-2 font-bold uppercase tracking-widest"
                    >
                        <Save size={20} />
                        Guardar Cambios
                    </button>
                    </>
                ) : (
                    /* Botón de Editar: DEBE ser type="button" y NO puede estar dentro de una etiqueta que dispare el submit */
                    <button 
                    type="button" 
                    onClick={(e) => {
                        e.preventDefault(); // Refuerzo para evitar que el navegador intente enviar el form
                        setEditando(true);
                    }}
                    className="bg-[#4a6b8a] text-white px-16 py-3 rounded-full hover:bg-[#34506d] shadow-lg transition-all flex items-center gap-2 font-bold uppercase tracking-widest"
                    >
                    <Edit3 size={20} />
                    Editar Registro
                    </button>
                )}
                </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetallesContrato;