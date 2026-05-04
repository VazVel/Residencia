import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Tags, ArrowLeft, Save, LayoutGrid, PlusCircle, Users, UserPlus, FolderPlus,LogOut } from 'lucide-react';

const GestionCatalogos = () => {
  const navigate = useNavigate();
  const [vista, setVista] = useState('menu'); // menu, proveedor, categoria

  // Estados para los formularios
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
      alert("Proveedor guardado con éxito en el sistema Bodesa");
      setVista('menu');
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
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      {/* HEADER ESTILO ADMINISTRADOR - BODESA */}
      <header className="bg-[#1d3557] text-white p-4 shadow-md border-b-4 border-[#f39c12]">
        <div className="max-w-[100%] mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <img src="/bodesa.png" alt="Bodesa" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider uppercase leading-none">Catálogos</span>
              <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Gestión de Registros</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase">
            <Link to="/proveedores" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <Building2 size={16} /> Proveedores
            </Link>
            <Link to="/nuevo-contrato" className="hover:text-gray-300 transition flex items-center gap-1.5 px-2">
              <PlusCircle size={16} /> Nuevo Contrato
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

      <main className="p-10 flex justify-center">
        <div className="max-w-5xl w-full">
          
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => vista === 'menu' ? navigate('/admin') : setVista('menu')}
              className="flex items-center gap-2 text-slate-600 hover:text-[#1d3557] font-black uppercase text-xs tracking-widest transition-all"
            >
              <ArrowLeft size={20} /> {vista === 'menu' ? 'Regresar al Dashboard' : 'Volver al Menú de Catálogos'}
            </button>
          </div>

          {vista === 'menu' && (
            <div className="grid grid-cols-2 gap-10 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setVista('proveedor')}
                className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center gap-6 border-b-8 border-blue-600 group"
              >
                <div className="bg-blue-50 p-8 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 size={64} />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-slate-800 uppercase block mb-2">Nuevo Proveedor</span>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Registra empresas prestadoras de servicios</p>
                </div>
              </button>

              <button 
                onClick={() => setVista('categoria')}
                className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center gap-6 border-b-8 border-[#1d3557] group"
              >
                <div className="bg-slate-50 p-8 rounded-full text-[#1d3557] group-hover:bg-[#1d3557] group-hover:text-white transition-colors">
                  <Tags size={64} />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-slate-800 uppercase block mb-2">Nueva Categoría</span>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Define tipos de contratos y servicios</p>
                </div>
              </button>
            </div>
          )}

          {/* FORMULARIO PROVEEDOR COMPLETO */}
          {vista === 'proveedor' && (
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-t-8 border-blue-600 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-10 border-b pb-6">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase leading-none">Registro de Proveedor</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Alta de razón social en base de datos</p>
                </div>
              </div>
              <form onSubmit={guardarProveedor} className="grid grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">RFC (ID Fiscal)</label>
                  <input type="text" maxLength={13} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="RFC123456ABC" value={proveedor.rfc} onChange={(e) => setProveedor({...proveedor, rfc: e.target.value.toUpperCase()})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Razón Social</label>
                  <input type="text" maxLength={100} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="Nombre legal de la empresa" value={proveedor.razonsocial} onChange={(e) => setProveedor({...proveedor, razonsocial: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Nombre Comercial</label>
                  <input type="text" maxLength={100} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="Nombre por el que se conoce" value={proveedor.nombrecomercial} onChange={(e) => setProveedor({...proveedor, nombrecomercial: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Teléfono de Contacto</label>
                  <input type="text" maxLength={20} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="10 dígitos" value={proveedor.telefono} onChange={(e) => setProveedor({...proveedor, telefono: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Correo Electrónico</label>
                  <input type="email" maxLength={50} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="contacto@empresa.com" value={proveedor.correo} onChange={(e) => setProveedor({...proveedor, correo: e.target.value})} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Dirección Fiscal Completa</label>
                  <input type="text" maxLength={100} className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="Calle, Número, Col., C.P." value={proveedor.direccionfiscal} onChange={(e) => setProveedor({...proveedor, direccionfiscal: e.target.value})} required />
                </div>
                <div className="col-span-2 text-center mt-6">
                  <button type="submit" className="bg-[#1d3557] text-white px-20 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 mx-auto">
                    <Save size={20} /> Guardar Proveedor
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FORMULARIO CATEGORÍA */}
          {vista === 'categoria' && (
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-t-8 border-[#1d3557] max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-10 border-b pb-6">
                <div className="bg-slate-50 p-3 rounded-full text-[#1d3557]">
                  <FolderPlus size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase leading-none">Nueva Categoría</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Clasificación de contratos</p>
                </div>
              </div>
              <form onSubmit={guardarCategoria} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Nombre del Tipo de Servicio</label>
                  <input 
                    type="text" 
                    maxLength={50}
                    placeholder="Mantenimiento, Software, etc."
                    className="w-full p-4 bg-pink-50/30 rounded-xl border border-pink-100 font-bold focus:ring-2 focus:ring-blue-400 outline-none transition-all" 
                    value={categoria.nombre_tipo}
                    onChange={(e) => setCategoria({nombre_tipo: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-[#1d3557] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl flex justify-center items-center gap-3">
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