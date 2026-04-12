import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

// Componentes de protección
import ProtectedRoute from './components/ProtectedRoute'

// Import de Páginas
import Login from './pages/Login'
import Home from './pages/Home'
import AgregarContrato from './pages/AgregarContrato'
import DetallesContrato from './pages/detallesContrato'
import GestionCatalogos from './pages/GestionCatalogos'
import DetallesProveedor from './pages/DetallesProveedor'
import ListaProveedores from './pages/ListaProveedores'
import AdminDashboard from './pages/AdminDashboard'
import GestionUsuarios from './pages/GestionUsuarios'
import NuevoUsuario from './pages/NuevoUsuario'
import EditarUsuario from './pages/EditarUsuario'

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/" element={<Login />} />
        
        {/* RUTAS PROTEGIDAS (Acceso general: Rol 1 y 2) */}
        <Route path="/home" element={
          <ProtectedRoute adminOnly={false}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/proveedores" element={
          <ProtectedRoute adminOnly={true}>
            <ListaProveedores />
          </ProtectedRoute>
        } />
        <Route path="/detalles-proveedor" element={
          <ProtectedRoute adminOnly={false} >
            <DetallesProveedor />
          </ProtectedRoute>
        } />
        <Route path="/ver-contrato" element={
          <ProtectedRoute adminOnly={false}>
            <DetallesContrato />
          </ProtectedRoute>
        } />

        {/* RUTAS PROTEGIDAS (Solo Administrador: Rol 1) */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/usuario" element={
          <ProtectedRoute adminOnly={true}>
            <GestionUsuarios />
          </ProtectedRoute>
        } />
        <Route path="/nuevo-usuario" element={
          <ProtectedRoute adminOnly={true}>
            <NuevoUsuario />
          </ProtectedRoute>
        } />
        <Route path="/editar-usuario" element={
          <ProtectedRoute adminOnly={true}>
            <EditarUsuario />
          </ProtectedRoute>
        } />
        <Route path="/nuevo-contrato" element={
          <ProtectedRoute adminOnly={false}>
            <AgregarContrato />
          </ProtectedRoute>
        } />
        <Route path="/gestion-catalogos" element={
          <ProtectedRoute adminOnly={true}>
            <GestionCatalogos />
          </ProtectedRoute>
        } />

        {/* CATCH-ALL: Redirige cualquier ruta desconocida al Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App