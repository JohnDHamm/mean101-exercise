'use strict';

const { json } = require('body-parser')
const { Server } = require('http');
const socketio = require('socket.io');
const express = require('express');
const mongoose = require('mongoose')

const app = express();
const server = Server(app); //creates second http server that listens to websockets
const io = socketio(server); //

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/meanchat'
const PORT = process.env.PORT || 3000

//middlewares
app.use(express.static('client')) //client folder
app.use(json())

app.get('/api/title', (req, res) =>
	res.send({ title: 'MEAN chat' })
)

const Message = mongoose.model('message', {
	author: String,
	content: String
})

app.get('/api/messages', (req, res, err) =>
	Message
		.find()
		.then(messages => res.json( {messages} ))
		.catch(err)
)

app.post('/api/messages', createMessage
	// (req, res, err) => {
	// const msg = req.body
	// Message
	// 	.create(msg)
	// 	.then(msg => { //for posting by POSTMAN or non-browser
	// 		io.emit('newMessage', msg)
	// 		return msg
	// 	})
	// 	.then(msg => res.status(201).json(msg))
	// 	.catch(err)
	// }
)

app.use('/api', (req, res) =>
  res.status(404).send({ code: 404, status: 'Not Found' })
)

app.use((req, res) =>
  res.sendFile(process.cwd() + '/client/index.html')
)

app.use((err, req, res, next) =>
  res.status(500).send({ code: 500, status: 'Internal Server Error', detail: err.stack })
)

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL, () =>
	// app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
	server.listen(PORT, () => console.log(`listening on port: ${PORT}`))
)

function createMessage (reqOrMsg, res, next) {
	const msg = reqOrMsg.body || reqOrMsg

	Message
		.create(msg)
		.then(msg => { //for posting by POSTMAN or non-browser
			io.emit('newMessage', msg)
			return msg
		})
		.then(msg => res && res.status(201).json(msg))
		.catch(err => {
			if (next) {
				return next(err)
			}
			console.error(err)
		})
}


io.on('connection', socket => {
	console.log(`Socket connected: ${socket.id}`)
	socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
	socket.on('postMessage', createMessage)
	// 	msg =>
	// 	Message
	// 		.create(msg)
	// 		// .then(msg => res.status(201).json(msg))
	// 		.then(msg => io.emit('newMessage', msg))
	// 		.catch(console.error)
	// )
})


