import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Marine Maroc</h2>
          <p>Fleet Management</p>
        </div>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>🏠</span> Tableau de bord
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>🗺️</span> Carte
          </NavLink>
          <NavLink to="/drivers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>👤</span> Chauffeurs
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>🚛</span> Véhicules
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>📦</span> Chargements
          </NavLink>
          <NavLink to="/locations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>📍</span> Lieux
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button onClick={logout} className="btn btn-secondary btn-block">
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
