const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./api-routes');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ===== API Routes =====
app.use('/api', apiRoutes);

// ===== Static Pages =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ===== Start Server =====
app.listen(port, () => {
    console.log(`✓ Server chạy tại http://localhost:${port}`);
});
