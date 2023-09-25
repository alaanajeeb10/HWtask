const express = require('express');
const app = express();
const port = 3233;

app.use(express.json());

const employeesRouter = require('./employeesRouter');
app.use('/employees', employeesRouter);

const logRouter = require('./logRouter');
app.use('/log', logRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
