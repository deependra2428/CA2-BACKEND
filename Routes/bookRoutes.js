const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Book = require('../models/bookModel');


router.post('/', async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!author || typeof author !== 'string' || author.trim() === '') {
            return res.status(400).json({
                message: "Author is required"
            });
        }

        if (!category || typeof category !== 'string' || category.trim() === '') {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        const book = new Book({
            title: title.trim(),
            author: author.trim(),
            category: category.trim()
        });

        await book.save();

        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while creating book"
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive integers"
            });
        }

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const totalRecords = await Book.countDocuments();

        res.status(200).json({
            books,
            currentPage: page,
            totalRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while getting books"
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const available = req.body.available;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        if (typeof available !== 'boolean') {
            return res.status(400).json({
                message: "Available must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { available: available },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book availability updated",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating book"
        });
    }
});

module.exports = router;
