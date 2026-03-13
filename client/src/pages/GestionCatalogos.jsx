import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building2, Tags, ArrowLeft, Save, Search, UserPlus, FolderPlus } from 'lucide-react';

const GestionCatalogos = () => {
  const navigate = useNavigate();
  const [vista, setVista] = useState('menu'); // menu, proveedor, categoria

  // Estados para los formularios (Incluyendo todos los campos de la DB)
  const [proveedor, setProveedor] = useState({
    rfc: '', 
    razonsocial: '', 
    nombrecomercial: '', 
    direccionfiscal: '', 
    telefono: '', 
    correo: ''
  });
  const [categoria, setCategoria] = useState({ nombre_tipo: '' });

  const guardarProveedor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/proveedores/nuevo', proveedor);
      alert("Proveedor guardado con éxito");
      setVista('menu');
      // Resetear estado
      setProveedor({ rfc: '', razonsocial: '', nombrecomercial: '', direccionfiscal: '', telefono: '', correo: '' });
    } catch (error) { 
      console.error(error);
      alert("Error al guardar proveedor"); 
    }
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/catcontratos/nuevo', categoria);
      alert("Categoría guardada con éxito");
      setVista('menu');
      setCategoria({ nombre_tipo: '' });
    } catch (error) { alert("Error al guardar categoría"); }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-[#4a6b8a] text-white p-4 shadow-md flex justify-between items-center px-8">
        <div className="flex items-center gap-6">
          <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-wider uppercase text-white">CONTRATOS</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <span className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/')}>Contratos</span>
          <span className="bg-[#1d3557]/30 px-4 py-2 rounded border-b-2 border-white/50">Gestión de Catálogos</span>
          <Search size={20} className="text-gray-200" />
        </div>
      </header>

      <main className="p-10 flex justify-center">
        <div className="max-w-5xl w-full">
          
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => vista === 'menu' ? navigate('/') : setVista('menu')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-all"
            >
              <ArrowLeft size={20} /> {vista === 'menu' ? 'Volver a Contratos' : 'Volver al Menú'}
            </button>
          </div>

          {vista === 'menu' && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setVista('proveedor')}
                className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 border-b-8 border-blue-600"
              >
                <div className="bg-blue-50 p-6 rounded-full text-blue-600">
                  <Building2 size={60} />
                </div>
                <span className="text-2xl font-black text-slate-800 uppercase">Nuevo Proveedor</span>
                <p className="text-gray-500 text-center font-medium">Registra empresas prestadoras de servicios</p>
              </button>

              <button 
                onClick={() => setVista('categoria')}
                className="bg-white p-12 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 border-b-8 border-[#4a6b8a]"
              >
                <div className="bg-slate-50 p-6 rounded-full text-[#4a6b8a]">
                  <Tags size={60} />
                </div>
                <span className="text-2xl font-black text-slate-800 uppercase">Nueva Categoría</span>
                <p className="text-gray-500 text-center font-medium">Define tipos de contratos (Mantenimiento, etc.)</p>
              </button>
            </div>
          )}

          {/* FORMULARIO PROVEEDOR COMPLETO */}
          {vista === 'proveedor' && (
            <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-4 border-blue-600">
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <UserPlus className="text-blue-600" size={30} />
                <h2 className="text-2xl font-black text-slate-800 uppercase">Registro de Proveedor</h2>
              </div>
              <form onSubmit={guardarProveedor} className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">RFC</label>
                  <input type="text" maxLength={13} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.rfc} onChange={(e) => setProveedor({...proveedor, rfc: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Razón Social</label>
                  <input type="text" maxLength={100} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.razonsocial} onChange={(e) => setProveedor({...proveedor, razonsocial: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Nombre Comercial</label>
                  <input type="text" maxLength={100} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.nombrecomercial} onChange={(e) => setProveedor({...proveedor, nombrecomercial: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Teléfono</label>
                  <input type="text" maxLength={20} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.telefono} onChange={(e) => setProveedor({...proveedor, telefono: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Dirección Fiscal</label>
                  <input type="text" maxLength={100} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.direccionfiscal} onChange={(e) => setProveedor({...proveedor, direccionfiscal: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">Correo Electrónico</label>
                  <input type="email" maxLength={50} className="w-full p-3 bg-pink-50/30 rounded border border-pink-100 outline-none focus:ring-1 focus:ring-blue-400" value={proveedor.correo} onChange={(e) => setProveedor({...proveedor, correo: e.target.value})} required />
                </div>
                <div className="col-span-2 text-center mt-6">
                  <button type="submit" className="bg-[#4a6b8a] text-white px-20 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#34506d] transition-all shadow-lg flex items-center gap-2 mx-auto">
                    <Save size={20} /> Guardar Proveedor
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FORMULARIO CATEGORÍA */}
          {vista === 'categoria' && (
            <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-4 border-[#4a6b8a] max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <FolderPlus className="text-[#4a6b8a]" size={30} />
                <h2 className="text-2xl font-black text-slate-800 uppercase">Nueva Categoría</h2>
              </div>
              <form onSubmit={guardarCategoria} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 uppercase">Nombre del Tipo</label>
                  <input 
                    type="text" 
                    maxLength={50}
                    placeholder="Ej. Mantenimiento, Software..."
                    className="w-full p-4 bg-pink-50/30 rounded border border-pink-100 focus:ring-2 focus:ring-blue-400 outline-none transition-all" 
                    value={categoria.nombre_tipo}
                    onChange={(e) => setCategoria({nombre_tipo: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-[#4a6b8a] text-white py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#34506d] transition-all shadow-lg flex justify-center items-center gap-2">
                  <Save size={20} /> Crear Categoría
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default GestionCatalogos;