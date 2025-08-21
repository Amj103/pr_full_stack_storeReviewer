import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Stores from './pages/Stores.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminStores from './pages/admin/AdminStores.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth, AuthProvider } from './lib/auth.jsx';



function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="card row" style={{ justifyContent:'space-between' }}>
      <div className="row">
        <Link to="/">Stores</Link>
        {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
        {user?.role === 'OWNER' && <Link to="/owner">Owner</Link>}
      </div>
      <div className="row">
        {user ? (<>
          <span>{user.name} ({user.role})</span>
          <button className="ghost" onClick={()=>{ logout(); navigate('/login'); }}>Logout</button>
          <Link to="/profile"><button>Profile</button></Link>
        </>) : (<>
          <Link to="/login">Login</Link>
          <Link to="/signup"><button>Sign up</button></Link>
        </>)}
      </div>
    </div>
  );
}

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ maxWidth: 1100, margin: '20px auto', padding: 12 }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Stores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Protected><Profile/></Protected>} />

          <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard/></Protected>} />
          <Route path="/admin/users" element={<Protected roles={['ADMIN']}><AdminUsers/></Protected>} />
          <Route path="/admin/stores" element={<Protected roles={['ADMIN']}><AdminStores/></Protected>} />

          <Route path="/owner" element={<Protected roles={['OWNER']}><OwnerDashboard/></Protected>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
