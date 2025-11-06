import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSocket } from '../contexts/SocketContext'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const [stats, setStats] = useState({
    drivers: 0,
    vehicles: 0,
    activeOrders: 0,
    locations: 0,
    driversAvailable: 0,
    driversOnTrip: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return

    const handleUpdate = () => {
      fetchDashboardData()
    }

    // Refresh dashboard when any resource is created/updated
    socket.on('order:created', handleUpdate)
    socket.on('order:updated', handleUpdate)
    socket.on('driver:created', handleUpdate)
    socket.on('driver:updated', handleUpdate)
    socket.on('vehicle:created', handleUpdate)
    socket.on('vehicle:updated', handleUpdate)

    return () => {
      socket.off('order:created', handleUpdate)
      socket.off('order:updated', handleUpdate)
      socket.off('driver:created', handleUpdate)
      socket.off('driver:updated', handleUpdate)
      socket.off('vehicle:created', handleUpdate)
      socket.off('vehicle:updated', handleUpdate)
    }
  }, [socket])

  const fetchDashboardData = async () => {
    try {
      const [driversRes, vehiclesRes, ordersRes, locationsRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles'),
        api.get('/orders'),
        api.get('/locations')
      ])

      const drivers = driversRes.data
      const orders = ordersRes.data

      setStats({
        drivers: drivers.length,
        vehicles: vehiclesRes.data.length,
        activeOrders: orders.filter(o => ['assigned', 'in_progress'].includes(o.status)).length,
        locations: locationsRes.data.length,
        driversAvailable: drivers.filter(d => d.status === 'available').length,
        driversOnTrip: drivers.filter(d => d.status === 'on_trip').length
      })

      // Get 5 most recent orders
      setRecentOrders(orders.slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Carte en temps réel',
      description: 'Suivre tous les véhicules',
      icon: '🗺️',
      color: '#0047AB',
      path: '/map'
    },
    {
      title: 'Nouveau chargement',
      description: 'Créer une commande',
      icon: '📦',
      color: '#00CED1',
      path: '/orders'
    },
    {
      title: 'Gérer les chauffeurs',
      description: 'Voir tous les chauffeurs',
      icon: '👤',
      color: '#10b981',
      path: '/drivers'
    },
    {
      title: 'Gérer les véhicules',
      description: 'Voir tous les véhicules',
      icon: '🚛',
      color: '#f59e0b',
      path: '/vehicles'
    },
    {
      title: 'Gérer les lieux',
      description: 'Points de chargement',
      icon: '📍',
      color: '#8b5cf6',
      path: '/locations'
    }
  ]

  const getStatusBadge = (status) => {
    const badges = {
      new: { class: 'badge-info', text: 'Nouveau' },
      assigned: { class: 'badge-warning', text: 'Assigné' },
      in_progress: { class: 'badge-warning', text: 'En route' },
      completed: { class: 'badge-success', text: 'Livré' },
      cancelled: { class: 'badge-error', text: 'Annulé' }
    }
    return badges[status] || { class: 'badge-info', text: status }
  }

  if (loading) {
    return <LoadingSpinner size="large" text="Chargement du tableau de bord..." />
  }

  return (
    <div className="home">
      <div className="home-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="home-subtitle">Vue d'ensemble de votre flotte</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#0047AB' }}>
            <span>👤</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.drivers}</div>
            <div className="stat-label">Chauffeurs</div>
            <div className="stat-detail">
              {stats.driversAvailable} disponibles · {stats.driversOnTrip} en route
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <span>🚛</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.vehicles}</div>
            <div className="stat-label">Véhicules</div>
            <div className="stat-detail">Flotte totale</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#00CED1' }}>
            <span>📦</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeOrders}</div>
            <div className="stat-label">Chargements actifs</div>
            <div className="stat-detail">En cours de livraison</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <span>📍</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.locations}</div>
            <div className="stat-label">Lieux</div>
            <div className="stat-detail">Points de chargement</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Accès rapide</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="quick-action-card"
              onClick={() => navigate(action.path)}
              style={{ borderTopColor: action.color }}
            >
              <div className="quick-action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <h3 className="quick-action-title">{action.title}</h3>
              <p className="quick-action-description">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Chargements récents</h2>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/orders')}
            >
              Voir tout
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Statut</th>
                  <th>Chauffeur</th>
                  <th>Départ → Arrivée</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <tr
                      key={order.id}
                      onClick={() => navigate('/orders')}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {order.orderNumber}
                      </td>
                      <td>
                        <span className={`badge ${badge.class}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td>
                        {order.driver ? (
                          <div>
                            <div style={{ fontWeight: 500 }}>{order.driver.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                              {order.vehicle?.plateNumber || 'Pas de véhicule'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--gray-400)' }}>Non assigné</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>
                          {order.pickupLocation?.name || '?'} →{' '}
                          {order.deliveryLocation?.name || '?'}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
