// Pagination helper
function getPagination(req) {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 50
  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip
  }
}

// Format pagination response
function formatPaginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

module.exports = {
  getPagination,
  formatPaginatedResponse
}
