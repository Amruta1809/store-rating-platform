import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUserList from './pages/admin/UserList.jsx';
import AdminAddUser from './pages/admin/AddUser.jsx';
import AdminUserDetail from './pages/admin/UserDetail.jsx';
import AdminStoreList from './pages/admin/StoreList.jsx';
import AdminAddStore from './pages/admin/AddStore.jsx';

import UserStoreList from './pages/user/StoreList.jsx';
import UpdatePassword from './pages/user/UpdatePassword.jsx';

import StoreOwnerDashboard from './pages/storeOwner/Dashboard.jsx';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/store-owner" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminUserList />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminAddUser />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminUserDetail />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminStoreList />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores/new"
          element={
            <RoleRoute roles={['ADMIN']}>
              <AdminAddStore />
            </RoleRoute>
          }
        />

        {/* Normal user */}
        <Route
          path="/stores"
          element={
            <RoleRoute roles={['NORMAL']}>
              <UserStoreList />
            </RoleRoute>
          }
        />

        {/* Shared: normal user + store owner */}
        <Route
          path="/update-password"
          element={
            <RoleRoute roles={['NORMAL', 'STORE_OWNER', 'ADMIN']}>
              <UpdatePassword />
            </RoleRoute>
          }
        />

        {/* Store owner */}
        <Route
          path="/store-owner"
          element={
            <RoleRoute roles={['STORE_OWNER']}>
              <StoreOwnerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="*"
          element={
            <PrivateRoute>
              <HomeRedirect />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
