const express = require('express');
const router = express.Router();
const apiClient = require('../utils/apiClient');

router.get('/', async (req, res) => {
  try {
    const users = await apiClient.getUsers();
    const userCommentCounts = await Promise.all(
      users.map(async (user) => {
        const posts = await apiClient.getUserPosts(user.id);
        const totalComments = await posts.reduce(async (accPromise, post) => {
          const acc = await accPromise;
          const comments = await apiClient.getPostComments(post.id);
          return acc + comments.length;
        }, Promise.resolve(0));
        return { ...user, totalComments };
      })
    );
    const topUsers = userCommentCounts
      .sort((a, b) => b.totalComments - a.totalComments)
      .slice(0, 5);
    
    res.json(topUsers);
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;