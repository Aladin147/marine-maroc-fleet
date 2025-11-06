import './EmptyState.css'

export default function EmptyState({ 
  icon = '📦', 
  title = 'Aucune donnée', 
  message = 'Commencez par ajouter des éléments',
  action,
  actionLabel = 'Ajouter'
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
