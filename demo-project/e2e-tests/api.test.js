const axios = require('axios');

const baseURL = 'http://app:3000';

async function runTests() {
  try {
    console.log('Starting API tests...');

    // Test 1: Add a new comment
    console.log('Test 1: Adding a new comment');
    const addCommentResponse = await axios.post(`${baseURL}/comments`, {
      comment: 'This is a test comment.',
    });
    console.log('Add Comment Response:', addCommentResponse.data);

    const { id, comment } = addCommentResponse.data;
    if (!id || comment !== 'This is a test comment.') {
      throw new Error('Test 1 failed: Comment not added correctly');
    }

    // Test 2: Fetch the comment by ID
    console.log('Test 2: Fetching the comment by ID');
    const getCommentResponse = await axios.get(`${baseURL}/comments/${id}`);
    console.log('Get Comment Response:', getCommentResponse.data);

    if (getCommentResponse.data.comment !== 'This is a test comment.') {
      throw new Error('Test 2 failed: Fetched comment does not match');
    }

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
