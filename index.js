const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Review = require('./models/Review');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Review Microservice is up and running!');
});

// Define Review Routes
app.post('/reviews', async (req, res) => {
    try {
      const { bookId, userId, rating, comment } = req.body;
  
      if (!bookId || !userId || !rating || !comment) {
        return res.status(400).json({ error: 'bookId, userId, rating, and comment are required.' });
      }
  
      const newReview = new Review({ bookId, userId, rating, comment });
      const savedReview = await newReview.save();
      res.status(201).json(savedReview);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/reviews/book/:bookId', async (req, res) => {
    try {
      const { bookId } = req.params;
      const reviews = await Review.find({ bookId }).populate('userId', 'name');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/reviews', async (req, res) => {
    try {
      const reviews = await Review.find().populate('bookId', 'title').populate('userId', 'name');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updatedReview) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      res.status(200).json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/reviews/book/:bookId/average-rating', async (req, res) => {
    try {
      const { bookId } = req.params;
  
      const average = await Review.aggregate([
        { $match: { bookId: mongoose.Types.ObjectId(bookId) } },
        { $group: { _id: '$bookId', averageRating: { $avg: '$rating' } } }
      ]);
  
      if (!average.length) {
        return res.status(404).json({ error: 'No reviews found for this book.' });
      }
  
      res.status(200).json({ bookId, averageRating: average[0].averageRating });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Start the Server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
