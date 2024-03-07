const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const generalRoutes = require('./Routes/generalRoutes')
const loginRoutes = require('./Routes/LoginRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const profsRoutes = require('./Routes/profsRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api', generalRoutes);
app.use('/login', loginRoutes);
app.use('/admin', adminRoutes);
app.use('/profs', profsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});