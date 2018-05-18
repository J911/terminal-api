const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT);