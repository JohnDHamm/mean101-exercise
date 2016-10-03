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

app.post('/api/messages', (req, res, err) => {
	const msg = req.body
	Message
		.create(msg)
		.then(msg => res.status(201).json(msg))
		.catch(err)
	}
)

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL, () =>
	// app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
	server.listen(PORT, () => console.log(`listening on port: ${PORT}`))
)

io.on('connection', socket => {
	console.log(`Socket connected: ${socket.id}`)
	socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
})


