'use strict';

const { json } = require('body-parser')
const express = require('express');
const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/meanchat'
const PORT = process.env.PORT || 3000

const app = express();

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
	// res.json({ //hard coding to test
	// 	messages: [
	// 		{
	// 			author: 'John',
	// 			content: 'Anyone here?!'
	// 		},
	// 		{
	// 			author: 'Jill',
	// 			content: 'nope'
	// 		}
	// 	]
	// })
)

app.post('/api/messages', (req, res, err) => {
	const msg = req.body
	Message
		.create(msg)
		.then(msg => res.json(msg))
		.catch(err)
	}
)

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL, () =>
	app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
)


