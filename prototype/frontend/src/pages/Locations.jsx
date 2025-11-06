import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    latitude: '',
    longitude: ''
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations')
      setLocations(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const data = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }
      
      if (editingLocation) {
        const response = await api.put(`/locations/${editingLocation.id}`, data)
        setLocations(locations.map(l => l.id === editingLocation.id ? response.data : l))
        toast.success('Lieu modifié avec succès')
      } else {
        const response = await api.post('/locations', data)
        setLocations([...locations, response.data])
        toast.success('Lieu créé avec succès')
      }
      handleCloseModal()
    } catch (err) {
      setFormError(err.response?.data?.error || `Failed to ${editingLocation ? 'update' : 'create'} location`)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address: location.address || '',
      type: location.type || '',
      latitude: location.latitude || '',
      longitude: location.longitude || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return

    try {
      await api.delete(`/locations/${id}`)
      setLocations(locations.filter(l => l.id !== id))
      toast.success('Lieu supprimé')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Échec de la suppression')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLocation(null)
    setFormData({ name: '', address: '', type: '', latitude: '', longitude: '' })
    setFormError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getTypeBadge = (type) => {
    const badges = {
      warehouse: 'badge-info',
      port: 'badge-warning',
      distribution_center: 'badge-success',
      customer: 'badge-info'
    }
    return badges[type] || 'badge-info'
  }

  const getTypeText = (type) => {
    const texts = {
      warehouse: 'Entrepôt',
      port: 'Port',
      distribution_center: 'Centre de distribution',
      customer: 'Client'
    }
    return texts[type] || type
  }

  // Filter locations based on search
  const filteredLocations = locations.filter(location => {
    return searchTerm === '' ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (location.address && location.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (location.type && location.type.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  if (loading) {
    return <LoadingSpinner text="Chargement des lieux..." />
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--error)' }}>{error}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--gray-800)', margin: 0 }}>Lieux</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau lieu
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, adresse ou type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '10px 15px',
            border: '1px solid var(--gray-300)',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Type</th>
              <th>Coordonnées GPS</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((location) => (
              <tr key={location.id}>
                <td style={{ fontWeight: 600 }}>{location.name}</td>
                <td>{location.address || '-'}</td>
                <td>
                  {location.type ? (
                    <span className={`badge ${getTypeBadge(location.type)}`}>
                      {getTypeText(location.type)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {location.latitude && location.longitude ? (
                    <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      <div>{location.latitude.toFixed(4)}°N</div>
                      <div>{location.longitude.toFixed(4)}°E</div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gray-400)' }}>Non défini</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px' }}
                      onClick={() => handleEdit(location)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px', color: 'var(--error)' }}
                      onClick={() => handleDelete(location.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLocations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucun lieu trouvé'}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingLocation ? 'Modifier le lieu' : 'Nouveau lieu'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="error-message">{formError}</div>}

          <div className="form-group">
            <label htmlFor="name">Nom du lieu *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Port de Casablanca, Entrepôt Tanger..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Rue Mohammed V, Casablanca"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type de lieu</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Sélectionner un type</option>
              <option value="warehouse">Entrepôt</option>
              <option value="port">Port</option>
              <option value="distribution_center">Centre de distribution</option>
              <option value="customer">Client</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="33.5731"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="-7.5898"
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
              {formLoading ? (editingLocation ? 'Modification...' : 'Création...') : (editingLocation ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
