import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import Modal from '../components/Modal'
import { useSocket } from '../contexts/SocketContext'
import EmptyState from '../components/EmptyState'
import { exportToCSV, formatForExport } from '../utils/export'

export default function Orders() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    orderNumber: '',
    pickupLocationId: '',
    deliveryLocationId: '',
    driverId: '',
    vehicleId: '',
    scheduledAt: '',
    customerName: '',
    customerPhone: '',
    notes: ''
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchDrivers()
    fetchVehicles()
    fetchLocations()
  }, [statusFilter])

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket) return

    socket.on('order:updated', (updatedOrder) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      )
      toast.success('Commande mise à jour en temps réel', { duration: 2000 })
    })

    socket.on('order:created', (newOrder) => {
      setOrders(prevOrders => [newOrder, ...prevOrders])
      toast.success('Nouvelle commande créée', { duration: 2000 })
    })

    return () => {
      socket.off('order:updated')
      socket.off('order:created')
    }
  }, [socket])

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const response = await api.get('/orders', { params })
      setOrders(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchDrivers = async () => {
    try {
      // Fetch available drivers for assignment
      const response = await api.get('/drivers/available')
      setDrivers(response.data)
    } catch (err) {
      console.error('Failed to load drivers:', err)
      // Fallback to all drivers if available endpoint fails
      try {
        const fallback = await api.get('/drivers')
        setDrivers(fallback.data)
      } catch (e) {
        console.error('Failed to load drivers fallback:', e)
      }
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (err) {
      console.error('Failed to load vehicles:', err)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations')
      setLocations(response.data)
    } catch (err) {
      console.error('Failed to load locations:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const data = {
        ...formData,
        pickupLocationId: formData.pickupLocationId ? parseInt(formData.pickupLocationId) : null,
        deliveryLocationId: formData.deliveryLocationId ? parseInt(formData.deliveryLocationId) : null,
        driverId: formData.driverId ? parseInt(formData.driverId) : null,
        vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : null,
        scheduledAt: formData.scheduledAt || null
      }
      
      if (editingOrder) {
        const response = await api.put(`/orders/${editingOrder.id}`, data)
        setOrders(orders.map(o => o.id === editingOrder.id ? response.data : o))
        toast.success('Chargement modifié avec succès')
      } else {
        const response = await api.post('/orders', data)
        setOrders([response.data, ...orders])
        toast.success('Chargement créé avec succès')
      }
      handleCloseModal()
    } catch (err) {
      setFormError(err.response?.data?.error || `Failed to ${editingOrder ? 'update' : 'create'} order`)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setFormData({
      orderNumber: order.orderNumber,
      pickupLocationId: order.pickupLocationId || '',
      deliveryLocationId: order.deliveryLocationId || '',
      driverId: order.driverId || '',
      vehicleId: order.vehicleId || '',
      scheduledAt: order.scheduledAt ? order.scheduledAt.split('T')[0] : '',
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      notes: order.notes || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chargement ?')) return

    try {
      await api.delete(`/orders/${id}`)
      setOrders(orders.filter(o => o.id !== id))
      toast.success('Chargement supprimé')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Échec de la suppression')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOrder(null)
    setFormData({
      orderNumber: '',
      pickupLocationId: '',
      deliveryLocationId: '',
      driverId: '',
      vehicleId: '',
      scheduledAt: '',
      customerName: '',
      customerPhone: '',
      notes: ''
    })
    setFormError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}`, { status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? response.data : o))
      toast.success('Statut mis à jour avec succès')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Échec de la mise à jour du statut')
    }
  }

  const handleExport = () => {
    const exportData = formatForExport(orders, [
      'orderNumber',
      'status',
      'pickupLocation.name',
      'deliveryLocation.name',
      'driver.name',
      'vehicle.plateNumber',
      'scheduledAt'
    ])
    exportToCSV(exportData, 'chargements')
    toast.success('Export réussi')
  }

  const getStatusBadge = (status) => {
    const badges = {
      new: 'badge-info',
      assigned: 'badge-warning',
      in_progress: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge-error'
    }
    return badges[status] || 'badge-info'
  }

  const getStatusText = (status) => {
    const texts = {
      new: 'Nouveau',
      assigned: 'Assigné',
      in_progress: 'En route',
      completed: 'Livré',
      cancelled: 'Annulé'
    }
    return texts[status] || status
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return <div className="card">Chargement...</div>
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--error)' }}>{error}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--gray-800)', margin: 0 }}>Chargements</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {orders.length > 0 && (
            <button className="btn btn-secondary" onClick={handleExport}>
              📥 Exporter CSV
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouveau chargement
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('all')}
        >
          Tous
        </button>
        <button
          className={`btn ${statusFilter === 'new' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('new')}
        >
          Nouveaux
        </button>
        <button
          className={`btn ${statusFilter === 'assigned' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('assigned')}
        >
          Assignés
        </button>
        <button
          className={`btn ${statusFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('in_progress')}
        >
          En route
        </button>
        <button
          className={`btn ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('completed')}
        >
          Livrés
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Statut</th>
              <th>Départ</th>
              <th>Arrivée</th>
              <th>Chauffeur</th>
              <th>Date prévue</th>
              <th>Changer statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={(e) => {
                  // Don't navigate if clicking on select or buttons
                  if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'BUTTON') {
                    navigate(`/orders/${order.id}`)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {order.orderNumber}
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>
                  {order.pickupLocation ? (
                    <div>
                      <div style={{ fontWeight: 500 }}>{order.pickupLocation.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        {order.pickupLocation.address}
                      </div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {order.deliveryLocation ? (
                    <div>
                      <div style={{ fontWeight: 500 }}>{order.deliveryLocation.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        {order.deliveryLocation.address}
                      </div>
                    </div>
                  ) : (
                    '-'
                  )}
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
                <td>{formatDate(order.scheduledAt)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--gray-300)',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="new">Nouveau</option>
                    <option value="assigned">Assigné</option>
                    <option value="in_progress">En route</option>
                    <option value="completed">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px' }}
                      onClick={() => handleEdit(order)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px', color: 'var(--error)' }}
                      onClick={() => handleDelete(order.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <EmptyState
            icon="📦"
            title="Aucun chargement"
            message="Créez votre premier chargement pour commencer à suivre vos livraisons"
            action={() => setShowModal(true)}
            actionLabel="+ Nouveau chargement"
          />
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingOrder ? 'Modifier le chargement' : 'Nouveau chargement'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="error-message">{formError}</div>}

          <div className="form-group">
            <label htmlFor="orderNumber">N° de commande *</label>
            <input
              id="orderNumber"
              name="orderNumber"
              type="text"
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="CMD-2024-001"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickupLocationId">Lieu de départ *</label>
            <select
              id="pickupLocationId"
              name="pickupLocationId"
              value={formData.pickupLocationId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un lieu</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="deliveryLocationId">Lieu d'arrivée *</label>
            <select
              id="deliveryLocationId"
              name="deliveryLocationId"
              value={formData.deliveryLocationId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un lieu</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="driverId">Chauffeur</label>
            <select
              id="driverId"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
            >
              <option value="">Non assigné</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vehicleId">Véhicule</label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
            >
              <option value="">Non assigné</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="scheduledAt">Date prévue</label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="date"
              value={formData.scheduledAt}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerName">Nom du client</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Nom de l'entreprise ou du client"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Téléphone du client</label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="+212600000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Instructions spéciales, détails de la cargaison..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
              disabled={formLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? (editingOrder ? 'Modification...' : 'Création...') : (editingOrder ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
