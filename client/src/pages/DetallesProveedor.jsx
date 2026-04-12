  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { Building2, Edit3, ArrowLeft, Save, Mail, Phone, Hash, MapPin, Globe } from 'lucide-react';

  const DetallesProveedor = () => {
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);
    const [loading, setLoading] = useState(true);

    // Recuperamos el rol para validar permisos
    const userRole = localStorage.getItem('userRole');

    const [formData, setFormData] = useState({
      idproveedor: '',
      rfc: '',
      razonsocial: '',
      nombrecomercial: '',
      direccionfiscal: '',
      telefono: '',
      correo: ''
    });

    useEffect(() => {
      const idGuardado = localStorage.getItem('selectedProviderId');
      
      if (!idGuardado) {
        alert("No se seleccionó ningún proveedor");
        navigate('/');
        return;
      }

      const fetchProveedor = async () => {
        try {
          const res = await axios.post('/api/proveedores/detalle', { idproveedor: idGuardado });
          const d = res.data;
          
          setFormData({
            idproveedor: d.idproveedor,
            rfc: d.rfc || '',
            razonsocial: d.razonsocial || '',
            nombrecomercial: d.nombrecomercial || '',
            direccionfiscal: d.direccionfiscal || '',
            telefono: d.telefono || '',
            correo: d.correo || ''
          });
          setLoading(false);
        } catch (error) {
          console.error("Error al cargar proveedor:", error);
          setLoading(false);
        }
      };

      fetchProveedor();
    }, [navigate]);

    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        await axios.put('/api/proveedores/actualizar', formData);
        alert("Información del proveedor actualizada");
        setEditando(false);
      } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Error al guardar los cambios");
      }
    };

    if (loading) return <div className="p-10 text-center font-bold italic text-slate-500">Cargando datos de Bodesa...</div>;

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-[#4a6b8a] text-white p-4 shadow-md flex justify-between items-center px-8">
          <div className="flex items-center gap-6">
            <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
            <span className="text-xl font-bold tracking-wider uppercase">Contratos</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <span className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/home')}>Contratos</span>
            <span className="bg-[#1d3557]/30 px-4 py-2 rounded border-b-2 border-white/50">Perfil Proveedor</span>
          </div>
        </header>

        <main className="p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                {editando ? 'Editar Proveedor' : 'Ficha del Proveedor'}
              </h1>
              <button 
                onClick={() => navigate('/proveedores')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-all"
              >
                <ArrowLeft size={20} /> Volver a la tabla
              </button>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-blue-600">
              <div className="flex items-center gap-3 mb-10 border-b pb-6">
                <Building2 className="text-blue-600" size={32} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 leading-none">{formData.razonsocial}</h2>
                  <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold">Datos de Registro Fiscal</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div className="relative">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <Hash size={14} /> RFC
                  </label>
                  <input 
                    type="text" 
                    maxLength={13}
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 cursor-not-allowed text-slate-600'}`}
                    value={formData.rfc}
                    onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <Building2 size={14} /> Razón Social
                  </label>
                  <input 
                    type="text" 
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 text-slate-600'}`}
                    value={formData.razonsocial}
                    onChange={(e) => setFormData({...formData, razonsocial: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <Globe size={14} /> Nombre Comercial
                  </label>
                  <input 
                    type="text" 
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 text-slate-600'}`}
                    value={formData.nombrecomercial}
                    onChange={(e) => setFormData({...formData, nombrecomercial: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <MapPin size={14} /> Dirección Fiscal
                  </label>
                  <input 
                    type="text" 
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 text-slate-600'}`}
                    value={formData.direccionfiscal}
                    onChange={(e) => setFormData({...formData, direccionfiscal: e.target.value})}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <Phone size={14} /> Teléfono de Contacto
                  </label>
                  <input 
                    type="text" 
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 text-slate-600'}`}
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase mb-2">
                    <Mail size={14} /> Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    disabled={!editando}
                    className={`w-full p-3 rounded-lg border font-bold transition-all ${editando ? 'bg-pink-50 border-pink-200 focus:ring-2 focus:ring-blue-400 outline-none' : 'bg-gray-50 border-gray-100 text-slate-600'}`}
                    value={formData.correo}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  />
                </div>

                {/* LÓGICA DE PERMISOS: Solo Admin (Rol 1) puede ver los botones de edición */}
                {parseInt(userRole) === 1 && (
                  <div className="col-span-2 flex justify-center mt-10 gap-6">
                    {editando ? (
                      <>
                        <button 
                          type="button" 
                          onClick={() => setEditando(false)}
                          className="bg-gray-500 text-white px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-gray-600 shadow-lg transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className="bg-green-600 text-white px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-green-700 shadow-lg transition-all flex items-center gap-2"
                        >
                          <Save size={20} /> Guardar Cambios
                        </button>
                      </>
                    ) : (
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); setEditando(true); }}
                        className="bg-[#4a6b8a] text-white px-20 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#34506d] shadow-lg transition-all flex items-center gap-2"
                      >
                        <Edit3 size={20} /> Editar Proveedor
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default DetallesProveedor;