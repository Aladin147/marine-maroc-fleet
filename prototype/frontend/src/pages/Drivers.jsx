import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { exportToCSV, formatForExport } from '../utils/export'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers')
      setDrivers(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load drivers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      if (editingDriver) {
        // Update existing driver
        const response = await api.put(`/drivers/${editingDriver.id}`, formData)
        setDrivers(drivers.map(d => d.id === editingDriver.id ? response.data : d))
        toast.success('Chauffeur modifié avec succès')
      } else {
        // Create new driver
        const response = await api.post('/drivers', formData)
        setDrivers([...drivers, response.data])
        toast.success('Chauffeur créé avec succès')
      }
      handleCloseModal()
    } catch (err) {
      setFormError(err.response?.data?.error || `Failed to ${editingDriver ? 'update' : 'create'} driver`)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || '',
      password: ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) return

    try {
      await api.delete(`/drivers/${id}`)
      setDrivers(drivers.filter(d => d.id !== id))
      toast.success('Chauffeur supprimé')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Échec de la suppression')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDriver(null)
    setFormData({ name: '', phone: '', email: '', password: '' })
    setFormError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleExport = () => {
    const exportData = formatForExport(filteredDrivers, [
      'name',
      'phone',
      'email',
      'status'
    ])
    exportToCSV(exportData, 'chauffeurs')
    toast.success('Export réussi')
  }

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge-success',
      on_trip: 'badge-warning',
      offline: 'badge-error',
      busy: 'badge-info'
    }
    return badges[status] || 'badge-info'
  }

  const getStatusText = (status) => {
    const texts = {
      available: 'Disponible',
      on_trip: 'En route',
      offline: 'Hors ligne',
      busy: 'Occupé'
    }
    return texts[status] || status
  }

  // Filter drivers based on search and status
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <LoadingSpinner text="Chargement des chauffeurs..." />
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--error)' }}>{error}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--gray-800)', margin: 0 }}>Chauffeurs</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {drivers.length > 0 && (
            <button className="btn btn-secondary" onClick={handleExport}>
              📥 Exporter CSV
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouveau chauffeur
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, téléphone ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '10px 15px',
            border: '1px solid var(--gray-300)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '1px solid var(--gray-300)',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="on_trip">En route</option>
          <option value="offline">Hors ligne</option>
          <option value="busy">Occupé</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Véhicule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id}>
                <td style={{ fontWeight: 500 }}>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.email || '-'}</td>
                <td>
                  <span className={`badge ${getStatusBadge(driver.status)}`}>
                    {getStatusText(driver.status)}
                  </span>
                </td>
                <td>
                  {driver.vehicles?.[0] ? (
                    <span>{driver.vehicles[0].plateNumber} - {driver.vehicles[0].make}</span>
                  ) : (
                    <span style={{ color: 'var(--gray-400)' }}>Aucun</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px' }}
                      onClick={() => handleEdit(driver)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px', color: 'var(--error)' }}
                      onClick={() => handleDelete(driver.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDrivers.length === 0 && drivers.length === 0 && (
          <EmptyState
            icon="👤"
            title="Aucun chauffeur"
            message="Commencez par ajouter votre premier chauffeur pour gérer votre flotte"
            action={() => setShowModal(true)}
            actionLabel="+ Ajouter un chauffeur"
          />
        )}
        {filteredDrivers.length === 0 && drivers.length > 0 && (
          <EmptyState
            icon="🔍"
            title="Aucun résultat"
            message="Aucun chauffeur ne correspond à vos critères de recherche"
          />
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingDriver ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="error-message">{formError}</div>}

          <div className="form-group">
            <label htmlFor="name">Nom complet *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212600000000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="chauffeur@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe (pour l'app mobile)
              {editingDriver && <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}> - Laisser vide pour ne pas changer</span>}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingDriver ? "Laisser vide pour ne pas changer" : "Optionnel"}
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
              {formLoading ? (editingDriver ? 'Modification...' : 'Création...') : (editingDriver ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
