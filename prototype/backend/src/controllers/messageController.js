const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get messages for an order
exports.getOrderMessages = async (req, res) => {
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

    const messages = await prisma.message.findMany({
      where: { orderId: parseInt(orderId) },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { orderId } = req.params
    const { content, type = 'text' } = req.body
    const senderId = req.user.id
    const companyId = req.user.companyId

    // Verify order belongs to company
    const order = await prisma.order.findFirst({
      where: { id: parseInt(orderId), companyId }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const message = await prisma.message.create({
      data: {
        companyId,
        orderId: parseInt(orderId),
        fromUserId: senderId,
        content,
        type,
        isRead: false
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
}

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    const message = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    })

    res.json(message)
  } catch (error) {
    console.error('Error marking message as read:', error)
    res.status(500).json({ error: 'Failed to mark message as read' })
  }
}
