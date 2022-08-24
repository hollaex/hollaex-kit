const express = require('express');
const nocache = require('nocache');
const app = express();
const PORT = 8080;

app.use(nocache());
app.use(express.static('dist'));
app.use(express.static('json'));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));