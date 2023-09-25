const express = require('express');
const router = express.Router();
const fs = require('fs');

const logs = JSON.parse(fs.readFileSync('logs.json', 'utf8'));

router.post('/login', (req, res) => {
    const { employeeId } = req.body;
    const time = new Date().toISOString();
    logs.push({ employeeId, time, type: 'login' });
    fs.writeFileSync('logs.json', JSON.stringify(logs));
    res.json({ message: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
    const { employeeId } = req.body;
    const time = new Date().toISOString();
    logs.push({ employeeId, time, type: 'logout' });
    fs.writeFileSync('logs.json', JSON.stringify(logs));
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
