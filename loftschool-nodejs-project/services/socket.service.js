const Chat = require('../db').models.chat

const users = []

module.exports = {
    socketServer: function (socket) {
        socket
        .on('users:connect', ({userId, username}) => {
            const _user = {
                username,
                socketId: socket.id,
                userId,
                activeRoom: null
            }
            users.push(_user)
            socket.emit('users:list', users)
            socket.broadcast.emit('users:add', _user)
        })
        .on('message:add', async (message) => {
            let dialog = {}

            const msg = {
                senderId: message.senderId,
                recipientId: message.recipientId,
                roomId: message.roomId,
                text: message.text
            }

            await Chat.create(msg)
            users.forEach((user) => {
                if (user.userId === message.recipientId) dialog.to = user.socketId
                if (user.userId === message.senderId) dialog.from = user.socketId
            })
            dialog.from === dialog.to ? socket.emit('message:add', message) : this.to(dialog.from).to(dialog.to).emit('message:add', message)
        })
        .on('message:history', async (dialog) => {
            const isMatchPersons = (dialog, msg) => {
                if (((dialog.recipientId === parseInt(msg.dataValues.recipientId)) && (dialog.userId === parseInt(msg.dataValues.senderId))) ||
                ((dialog.recipientId === parseInt(msg.dataValues.senderId)) && (dialog.userId === parseInt(msg.dataValues.recipientId))))
                    {
                        return true
                    } else 
                        {return false}
            }
            const history = (await Chat.findAll()).filter((msg) => 
                isMatchPersons(dialog, msg) ? true : false
            )
            socket.emit('message:history', history)
        })
        .on('disconnect', () => {
            users.forEach((user, index) => {
                if (user.socketId === socket.id) users.splice(index, 1)
            })
        socket.broadcast.emit('users:leave', socket.id)
        })
    }
}
