'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 3000
//middlewares
app.use(express.static('client')) //client folder

app.get('/api/title', (req, res) =>
	res.send({ title: 'MEAN 101 from Node' })
)

app.listen(port, () => console.log(`listening on port: ${port}`))
