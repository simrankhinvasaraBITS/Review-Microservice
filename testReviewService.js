const axios = require('axios');

const baseURL = 'http://localhost:3004';
const testBookId = '64a3d4c8f1c4b9d87d9a1234'; // Replace with valid book ID
const testUserId = '64a3d4c8f1c4b9d87d9a5678'; // Replace with valid user ID
let reviewId;

async function addReview() {
  try {
    const response = await axios.post(`${baseURL}/reviews`, {
      bookId: testBookId,
      userId: testUserId,
      rating: 5,
      comment: 'Amazing book! Highly recommend.'
    });
    console.log('Add Review Response:', response.data);
    reviewId = response.data._id;
  } catch (error) {
    console.error('Error Adding Review:', error.response?.data || error.message);
  }
}

async function getAllReviews() {
  try {
    const response = await axios.get(`${baseURL}/reviews`);
    console.log('All Reviews:', response.data);
  } catch (error) {
    console.error('Error Fetching Reviews:', error.response?.data || error.message);
  }
}

async function getReviewsForBook() {
  try {
    const response = await axios.get(`${baseURL}/reviews/book/${testBookId}`);
    console.log(`Reviews for Book ${testBookId}:`, response.data);
  } catch (error) {
    console.error('Error Fetching Reviews for Book:', error.response?.data || error.message);
  }
}

async function updateReview() {
  try {
    if (!reviewId) {
      console.error('No review ID available for update.');
      return;
    }
    const response = await axios.put(`${baseURL}/reviews/${reviewId}`, {
      rating: 4,
      comment: 'Updated review: Still a great book.'
    });
    console.log('Update Review Response:', response.data);
  } catch (error) {
    console.error('Error Updating Review:', error.response?.data || error.message);
  }
}

async function deleteReview() {
  try {
    if (!reviewId) {
      console.error('No review ID available for deletion.');
      return;
    }
    const response = await axios.delete(`${baseURL}/reviews/${reviewId}`);
    console.log('Delete Review Response:', response.data);
  } catch (error) {
    console.error('Error Deleting Review:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('Starting Review Service Tests...');
  await addReview();
  await getAllReviews();
  await getReviewsForBook();
  await updateReview();
  await deleteReview();
  console.log('Finished Review Service Tests.');
}

runTests();
