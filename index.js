const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bookRoutes = require('./Routes/bookRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Library Book Management API is running"
    });
});

app.use('/api/books', bookRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: "Invalid JSON body"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 3030;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/libraryDB';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("DB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error in db connection");
        console.log(error.message);
    });
