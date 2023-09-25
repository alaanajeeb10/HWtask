const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3233;

// חיבור לבסיס הנתונים SQLite3
const db = new sqlite3.Database('attendance.db');

// יצירת טבלת עובדים (אם אינה קיימת)
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, id_number TEXT, name TEXT, job_title TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INTEGER, timestamp DATETIME, type TEXT)");
});

// מידלוור עבור Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// מסך ניהול עובדים - הצגת רשימת עובדים
app.get('/employees', (req, res) => {
    db.all("SELECT * FROM employees", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ employees: rows });
    });
});

// מסך ניהול עובדים - הוספת עובד
app.post('/employees', (req, res) => {
    const { id_number, name, job_title } = req.body;
    db.run("INSERT INTO employees (id_number, name, job_title) VALUES (?, ?, ?)", [id_number, name, job_title], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// מסך ניהול עובדים - מחיקת עובד
app.delete('/employees/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM employees WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// מסך כניסה/יציאה - הוספת רישום
app.post('/attendance', (req, res) => {
    const { employee_id, timestamp, type } = req.body;
    db.run("INSERT INTO attendance (employee_id, timestamp, type) VALUES (?, ?, ?)", [employee_id, timestamp, type], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// מסך כניסה/יציאה - רשימת כניסות ויציאות לעובד מסוים
app.get('/attendance/:employee_id', (req, res) => {
    const employeeId = req.params.employee_id;
    db.all("SELECT * FROM attendance WHERE employee_id = ?", employeeId, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ attendance: rows });
    });
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
