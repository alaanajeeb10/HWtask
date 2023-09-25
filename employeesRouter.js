const express = require('express');
const router = express.Router();
const fs = require('fs');

const employees = JSON.parse(fs.readFileSync('employees.json', 'utf8'));

router.get('/', (req, res) => {
    res.json(employees);
});

router.post('/', (req, res) => {
    const newEmployee = req.body;
    employees.push(newEmployee);
    fs.writeFileSync('employees.json', JSON.stringify(employees));
    res.json(newEmployee);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedEmployee = req.body;
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = updatedEmployee;
        fs.writeFileSync('employees.json', JSON.stringify(employees));
        res.json(updatedEmployee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees.splice(index, 1);
        fs.writeFileSync('employees.json', JSON.stringify(employees));
        res.json({ message: 'Employee deleted' });
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

module.exports = router;
