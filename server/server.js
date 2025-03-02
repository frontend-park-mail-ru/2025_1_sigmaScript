'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public/static')));
app.use(express.static(path.resolve(__dirname, '..', 'public/utils')));
app.use(express.static(path.resolve(__dirname, '..', 'public/components')));
app.use(express.static(path.resolve(__dirname, '..', 'public/pages')));
app.use(express.static(path.resolve(__dirname, '..', 'public/')));
app.use(express.static(path.resolve(__dirname, '..', 'public/components')));
// app.use(express.static(path.resolve(__dirname, '..', 'public/components/navbar')));
app.use(express.static(path.resolve(__dirname, '..', 'node_modules')));
// app.use(express.static(path.resolve(__dirname, '..', 'public/static/svg/')));
app.use(express.static(path.resolve(__dirname, '..', 'public/static/')));

app.use(body.json());
app.use(cookie());

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port http://localhost:${port}`);
});
