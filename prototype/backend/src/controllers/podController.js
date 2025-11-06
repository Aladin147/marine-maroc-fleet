const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get POD for an order
exports.getOrderPOD = async (req, res) => {
  try {
    const { orderId } = req.params
    const companyId = req.user.companyId

    // Verify order belongs to company
    const order = await prisma.order.findFirst({
      where: { id: parseInt(orderId), companyId }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const pod = await prisma.proofOfDelivery.findUnique({
      where: { orderId: parseInt(orderId) }
    })

    if (!pod) {
      return res.status(404).json({ error: 'POD not found' })
    }

    res.json(pod)
  } catch (error) {
    console.error('Error fetching POD:', error)
    res.status(500).json({ error: 'Failed to fetch POD' })
  }
}

// Create or update POD
exports.savePOD = async (req, res) => {
  try {
    const { orderId } = req.params
    const { recipientName, recipientSignature, photos, notes } = req.body
    const companyId = req.user.companyId

    // Verify order belongs to company
    const order = await prisma.order.findFirst({
      where: { id: parseInt(orderId), companyId }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Check if POD already exists
    const existing = await prisma.proofOfDelivery.findUnique({
      where: { orderId: parseInt(orderId) }
    })

    let pod
    if (existing) {
      // Update existing POD
      pod = await prisma.proofOfDelivery.update({
        where: { orderId: parseInt(orderId) },
        data: {
          recipientName,
          recipientSignature,
          photos,
          notes,
          deliveredAt: new Date()
        }
      })
    } else {
      // Create new POD
      pod = await prisma.proofOfDelivery.create({
        data: {
          orderId: parseInt(orderId),
          recipientName,
          recipientSignature,
          photos,
          notes,
          deliveredAt: new Date()
        }
      })
    }

    // Update order status to completed
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: 'completed' }
    })

    res.json(pod)
  } catch (error) {
    console.error('Error saving POD:', error)
    res.status(500).json({ error: 'Failed to save POD' })
  }
}
