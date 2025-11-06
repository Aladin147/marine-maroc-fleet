// Export data to CSV
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle nested objects, arrays, null, undefined
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';')
        // Escape commas and quotes
        const stringValue = String(value).replace(/"/g, '""')
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Format data for export (flatten nested objects)
export function formatForExport(data, fields) {
  return data.map(item => {
    const formatted = {}
    fields.forEach(field => {
      if (field.includes('.')) {
        // Handle nested fields like "driver.name"
        const parts = field.split('.')
        let value = item
        for (const part of parts) {
          value = value?.[part]
        }
        formatted[field] = value
      } else {
        formatted[field] = item[field]
      }
    })
    return formatted
  })
}
