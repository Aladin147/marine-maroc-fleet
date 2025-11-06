import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import './OrderDetails.css'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [messages, setMessages] = useState([])
  const [pod, setPod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  
  // Message form
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  
  // POD form
  const [podForm, setPodForm] = useState({
    recipientName: '',
    recipientSignature: '',
    photos: [],
    notes: ''
  })
  const [savingPod, setSavingPod] = useState(false)

  useEffect(() => {
    fetchOrderDetails()
    fetchMessages()
    fetchPOD()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${id}`)
      setOrder(response.data)
    } catch (err) {
      toast.error('Échec du chargement de la commande')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/orders/${id}`)
      setMessages(response.data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const fetchPOD = async () => {
    try {
      const response = await api.get(`/pod/orders/${id}`)
      setPod(response.data)
      setPodForm({
        recipientName: response.data.recipientName || '',
        recipientSignature: response.data.recipientSignature || '',
        photos: response.data.photos || [],
        notes: response.data.notes || ''
      })
    } catch (err) {
      // POD might not exist yet
      console.log('No POD found')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageContent.trim()) return

    setSendingMessage(true)
    try {
      const response = await api.post(`/messages/orders/${id}`, {
        content: messageContent,
        type: 'text'
      })
      setMessages([response.data, ...messages])
      setMessageContent('')
      toast.success('Message envoyé')
    } catch (err) {
      toast.error('Échec de l\'envoi du message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleSavePOD = async (e) => {
    e.preventDefault()
    setSavingPod(true)
    try {
      const response = await api.post(`/pod/orders/${id}`, podForm)
      setPod(response.data)
      toast.success('Preuve de livraison enregistrée')
      // Refresh order to show completed status
      fetchOrderDetails()
    } catch (err) {
      toast.error('Échec de l\'enregistrement')
    } finally {
      setSavingPod(false)
    }
  }

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

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="order-details-loading">Chargement...</div>
  }

  if (!order) {
    return <div className="order-details-error">Commande introuvable</div>
  }

  const badge = getStatusBadge(order.status)

  return (
    <div className="order-details">
      <div className="order-details-header">
        <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
          ← Retour
        </button>
        <div className="order-details-title">
          <h1>{order.orderNumber}</h1>
          <span className={`badge ${badge.class}`}>{badge.text}</span>
        </div>
      </div>

      <div className="order-details-tabs">
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Détails
        </button>
        <button
          className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages ({messages.length})
        </button>
        <button
          className={`tab ${activeTab === 'pod' ? 'active' : ''}`}
          onClick={() => setActiveTab('pod')}
        >
          Preuve de livraison {pod && '✓'}
        </button>
      </div>

      <div className="order-details-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="details-grid">
              <div className="detail-card">
                <h3>Informations générales</h3>
                <div className="detail-row">
                  <span className="label">N° Commande:</span>
                  <span className="value">{order.orderNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Statut:</span>
                  <span className={`badge ${badge.class}`}>{badge.text}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date prévue:</span>
                  <span className="value">{formatDate(order.scheduledAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Créé le:</span>
                  <span className="value">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="detail-card">
                <h3>Chauffeur & Véhicule</h3>
                {order.driver ? (
                  <>
                    <div className="detail-row">
                      <span className="label">Chauffeur:</span>
                      <span className="value">{order.driver.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Téléphone:</span>
                      <span className="value">{order.driver.phone}</span>
                    </div>
                  </>
                ) : (
                  <p className="no-data">Aucun chauffeur assigné</p>
                )}
                {order.vehicle ? (
                  <>
                    <div className="detail-row">
                      <span className="label">Véhicule:</span>
                      <span className="value">{order.vehicle.plateNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Modèle:</span>
                      <span className="value">{order.vehicle.make} {order.vehicle.model}</span>
                    </div>
                  </>
                ) : (
                  <p className="no-data">Aucun véhicule assigné</p>
                )}
              </div>

              <div className="detail-card">
                <h3>Départ</h3>
                {order.pickupLocation ? (
                  <>
                    <div className="detail-row">
                      <span className="label">Lieu:</span>
                      <span className="value">{order.pickupLocation.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Adresse:</span>
                      <span className="value">{order.pickupLocation.address || '-'}</span>
                    </div>
                  </>
                ) : (
                  <p className="no-data">Lieu de départ non défini</p>
                )}
              </div>

              <div className="detail-card">
                <h3>Arrivée</h3>
                {order.deliveryLocation ? (
                  <>
                    <div className="detail-row">
                      <span className="label">Lieu:</span>
                      <span className="value">{order.deliveryLocation.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Adresse:</span>
                      <span className="value">{order.deliveryLocation.address || '-'}</span>
                    </div>
                  </>
                ) : (
                  <p className="no-data">Lieu d'arrivée non défini</p>
                )}
              </div>

              {order.customerName && (
                <div className="detail-card">
                  <h3>Client</h3>
                  <div className="detail-row">
                    <span className="label">Nom:</span>
                    <span className="value">{order.customerName}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="detail-row">
                      <span className="label">Téléphone:</span>
                      <span className="value">{order.customerPhone}</span>
                    </div>
                  )}
                </div>
              )}

              {order.notes && (
                <div className="detail-card full-width">
                  <h3>Notes</h3>
                  <p className="notes">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-tab">
            <form onSubmit={handleSendMessage} className="message-form">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Écrire un message au chauffeur..."
                rows="3"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sendingMessage || !messageContent.trim()}
              >
                {sendingMessage ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>

            <div className="messages-list">
              {messages.length === 0 ? (
                <p className="no-messages">Aucun message</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="message-item">
                    <div className="message-header">
                      <strong>{message.fromUser?.name || 'Utilisateur'}</strong>
                      <span className="message-time">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="message-content">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'pod' && (
          <div className="pod-tab">
            {pod && order.status === 'completed' ? (
              <div className="pod-view">
                <div className="pod-success">
                  <span className="success-icon">✓</span>
                  <h3>Livraison confirmée</h3>
                  <p>Livré le {formatDate(pod.deliveredAt)}</p>
                </div>
                <div className="pod-details">
                  <div className="detail-row">
                    <span className="label">Reçu par:</span>
                    <span className="value">{pod.recipientName}</span>
                  </div>
                  {pod.recipientSignature && (
                    <div className="detail-row">
                      <span className="label">Signature:</span>
                      <span className="value">✓ Signée</span>
                    </div>
                  )}
                  {pod.notes && (
                    <div className="detail-row">
                      <span className="label">Notes:</span>
                      <span className="value">{pod.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePOD} className="pod-form">
                <h3>Enregistrer la preuve de livraison</h3>
                <div className="form-group">
                  <label htmlFor="recipientName">Nom du destinataire *</label>
                  <input
                    id="recipientName"
                    type="text"
                    value={podForm.recipientName}
                    onChange={(e) => setPodForm({ ...podForm, recipientName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipientSignature">Signature (texte)</label>
                  <input
                    id="recipientSignature"
                    type="text"
                    value={podForm.recipientSignature}
                    onChange={(e) => setPodForm({ ...podForm, recipientSignature: e.target.value })}
                    placeholder="Signature du destinataire"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={podForm.notes}
                    onChange={(e) => setPodForm({ ...podForm, notes: e.target.value })}
                    rows="3"
                    placeholder="Remarques sur la livraison..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPod}
                >
                  {savingPod ? 'Enregistrement...' : 'Confirmer la livraison'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
