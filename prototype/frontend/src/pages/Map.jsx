import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import api from '../lib/api'
import 'leaflet/dist/leaflet.css'
import './Map.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom truck icon
const truckIcon = new L.DivIcon({
  className: 'custom-truck-icon',
  html: `<div class="truck-marker">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})

export default function Map() {
  const [positions, setPositions] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchPositions()
    // Refresh every 10 seconds for more real-time feel
    const interval = setInterval(fetchPositions, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await api.get('/tracking/vehicles/positions')
      setPositions(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load positions')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async (driverId) => {
    try {
      const response = await api.get(`/tracking/vehicles/${driverId}/history?hours=3`)
      setHistory(response.data)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  const handleMarkerClick = (position) => {
    setSelectedDriver(position)
    fetchHistory(position.driverId)
  }

  const formatSpeed = (speed) => {
    return speed ? `${Math.round(speed)} km/h` : 'N/A'
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      available: '#10b981',
      on_trip: '#f59e0b',
      offline: '#6b7280',
      busy: '#3b82f6'
    }
    return colors[status] || '#6b7280'
  }

  if (loading) {
    return <div className="card">Chargement de la carte...</div>
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--error)' }}>{error}</div>
  }

  // Center map on Morocco
  const center = [33.5731, -7.5898] // Casablanca
  const zoom = 7

  return (
    <div className="map-page">
      <div className="map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            className="btn btn-secondary mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕' : '☰'} Véhicules
          </button>
          <h1>Suivi en temps réel</h1>
        </div>
        <div className="map-stats">
          <div className="stat">
            <span className="stat-value">{positions.length}</span>
            <span className="stat-label">Véhicules actifs</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {positions.filter(p => p.activeOrder).length}
            </span>
            <span className="stat-label">En livraison</span>
          </div>
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Vehicle markers */}
          {positions.map((position) => (
            <Marker
              key={position.driverId}
              position={[position.latitude, position.longitude]}
              icon={truckIcon}
              eventHandlers={{
                click: () => handleMarkerClick(position)
              }}
            >
              <Popup>
                <div className="marker-popup">
                  <h3>{position.driverName}</h3>
                  {position.vehicle && (
                    <p className="vehicle-info">
                      <strong>{position.vehicle.plateNumber}</strong>
                      <br />
                      {position.vehicle.make} {position.vehicle.model}
                    </p>
                  )}
                  <div className="popup-details">
                    <div className="detail-row">
                      <span>Vitesse:</span>
                      <span>{formatSpeed(position.speed)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Dernière mise à jour:</span>
                      <span>{formatTime(position.recordedAt)}</span>
                    </div>
                    {position.activeOrder && (
                      <div className="active-order">
                        <strong>Commande active:</strong>
                        <p>{position.activeOrder.orderNumber}</p>
                        <p className="route">
                          {position.activeOrder.pickupLocation?.name} →{' '}
                          {position.activeOrder.deliveryLocation?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Show route history for selected driver */}
          {selectedDriver && history.length > 1 && (
            <Polyline
              positions={history.map(h => [h.latitude, h.longitude])}
              color={getStatusColor(selectedDriver.driverStatus)}
              weight={3}
              opacity={0.6}
            />
          )}
        </MapContainer>

        {/* Sidebar with driver list */}
        <div className={`map-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h3>Véhicules</h3>
          <div className="driver-list">
            {positions.map((position) => (
              <div
                key={position.driverId}
                className={`driver-card ${selectedDriver?.driverId === position.driverId ? 'selected' : ''}`}
                onClick={() => handleMarkerClick(position)}
              >
                <div className="driver-header">
                  <div>
                    <div className="driver-name">{position.driverName}</div>
                    {position.vehicle && (
                      <div className="driver-vehicle">
                        {position.vehicle.plateNumber}
                      </div>
                    )}
                  </div>
                  <div
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(position.driverStatus) }}
                  />
                </div>
                <div className="driver-details">
                  <div className="detail-item">
                    <span className="detail-label">Vitesse:</span>
                    <span className="detail-value">{formatSpeed(position.speed)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mise à jour:</span>
                    <span className="detail-value">{formatTime(position.recordedAt)}</span>
                  </div>
                </div>
                {position.activeOrder && (
                  <div className="driver-order">
                    <div className="order-badge">En livraison</div>
                    <div className="order-number">{position.activeOrder.orderNumber}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
