import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('userRole');

  // 1. Si no hay token, lo mandamos al login de inmediato
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Si la ruta es solo para admin (rol 1) y el usuario no lo es, 
  // lo mandamos a la home de usuarios normales
  if (adminOnly && parseInt(rol) !== 1) {
    return <Navigate to="/home" replace />;
  }

  // Si todo está bien, renderizamos la pantalla solicitada
  return children;
};

export default ProtectedRoute;
