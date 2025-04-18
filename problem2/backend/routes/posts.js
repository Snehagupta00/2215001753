const express = require('express');
const router = express.Router();
const apiClient = require('../utils/apiClient');

router.get('/', async (req, res) => {
  const { type } = req.query;
  
  try {
    if (type === 'popular') {
      const users = await apiClient.getUsers();
      let allPosts = [];
      
      for (const user of users) {
        const posts = await apiClient.getUserPosts(user.id);
        allPosts = allPosts.concat(posts);
      }
      const postsWithComments = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await apiClient.getPostComments(post.id);
          return { ...post, commentCount: comments.length };
        })
      );
      const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));
      const trendingPosts = postsWithComments.filter(p => p.commentCount === maxComments);
      
      res.json(trendingPosts);
    } else if (type === 'latest') {
      const users = await apiClient.getUsers();
      let allPosts = [];
      
      for (const user of users) {
        const posts = await apiClient.getUserPosts(user.id);
        allPosts = allPosts.concat(posts);
      }
      const latestPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
      
      res.json(latestPosts);
    } else {
      res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;