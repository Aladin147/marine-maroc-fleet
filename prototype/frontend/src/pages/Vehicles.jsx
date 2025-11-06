import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { exportToCSV, formatForExport } from '../utils/export'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    driverId: ''
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVehicles()
    fetchDrivers()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers')
      setDrivers(response.data)
    } catch (err) {
      console.error('Failed to load drivers:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const data = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        driverId: formData.driverId ? parseInt(formData.driverId) : null
      }
      
      if (editingVehicle) {
        // Update existing vehicle
        const response = await api.put(`/vehicles/${editingVehicle.id}`, data)
        setVehicles(vehicles.map(v => v.id === editingVehicle.id ? response.data : v))
        toast.success('Véhicule modifié avec succès')
      } else {
        // Create new vehicle
        const response = await api.post('/vehicles', data)
        setVehicles([...vehicles, response.data])
        toast.success('Véhicule créé avec succès')
      }
      handleCloseModal()
    } catch (err) {
      setFormError(err.response?.data?.error || `Failed to ${editingVehicle ? 'update' : 'create'} vehicle`)
      toast.error('Erreur lors de l\'enregistrement')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      plateNumber: vehicle.plateNumber,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      driverId: vehicle.driverId || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return

    try {
      await api.delete(`/vehicles/${id}`)
      setVehicles(vehicles.filter(v => v.id !== id))
      toast.success('Véhicule supprimé')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Échec de la suppression')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVehicle(null)
    setFormData({ plateNumber: '', make: '', model: '', year: '', driverId: '' })
    setFormError('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleExport = () => {
    const exportData = formatForExport(filteredVehicles, [
      'plateNumber',
      'make',
      'model',
      'year',
      'driver.name'
    ])
    exportToCSV(exportData, 'vehicules')
    toast.success('Export réussi')
  }

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter(vehicle => {
    return searchTerm === '' ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.make && vehicle.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.driver && vehicle.driver.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  if (loading) {
    return <LoadingSpinner text="Chargement des véhicules..." />
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--error)' }}>{error}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--gray-800)', margin: 0 }}>Véhicules</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {vehicles.length > 0 && (
            <button className="btn btn-secondary" onClick={handleExport}>
              📥 Exporter CSV
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouveau véhicule
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par plaque, marque, modèle ou chauffeur..."
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
              <th>Plaque</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Année</th>
              <th>Chauffeur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {vehicle.plateNumber}
                </td>
                <td>{vehicle.make || '-'}</td>
                <td>{vehicle.model || '-'}</td>
                <td>{vehicle.year || '-'}</td>
                <td>
                  {vehicle.driver ? (
                    <div>
                      <div style={{ fontWeight: 500 }}>{vehicle.driver.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        {vehicle.driver.phone}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gray-400)' }}>Non assigné</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px' }}
                      onClick={() => handleEdit(vehicle)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '14px', color: 'var(--error)' }}
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVehicles.length === 0 && vehicles.length === 0 && (
          <EmptyState
            icon="🚛"
            title="Aucun véhicule"
            message="Ajoutez votre premier véhicule pour commencer à gérer votre flotte"
            action={() => setShowModal(true)}
            actionLabel="+ Ajouter un véhicule"
          />
        )}
        {filteredVehicles.length === 0 && vehicles.length > 0 && (
          <EmptyState
            icon="🔍"
            title="Aucun résultat"
            message="Aucun véhicule ne correspond à votre recherche"
          />
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingVehicle ? 'Modifier le véhicule' : 'Nouveau véhicule'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div className="error-message">{formError}</div>}

          <div className="form-group">
            <label htmlFor="plateNumber">Plaque d'immatriculation *</label>
            <input
              id="plateNumber"
              name="plateNumber"
              type="text"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="A-12345"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="make">Marque</label>
            <input
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              placeholder="Mercedes, Volvo, Scania..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Modèle</label>
            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              placeholder="Actros, FH16, R500..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Année</label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              placeholder="2020"
              min="1990"
              max="2030"
            />
          </div>

          <div className="form-group">
            <label htmlFor="driverId">Chauffeur assigné</label>
            <select
              id="driverId"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
            >
              <option value="">Aucun</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.phone}
                </option>
              ))}
            </select>
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
              {formLoading ? (editingVehicle ? 'Modification...' : 'Création...') : (editingVehicle ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
