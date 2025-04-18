const axios = require('axios');

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const cache = new Map();
let authToken = null;
async function authenticate() {
  try {
    const response = await axios.post(`${BASE_URL}/auth`, {
      username: 'Sneha', 
      password: 'Sneha@123' 
    });
    authToken = response.data.token; 
    console.log('Authentication successful, token:', authToken);
    return authToken;
  } catch (error) {
    const errorDetails = error.response
      ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
      : error.message;
    console.error('Authentication failed:', errorDetails);
    throw new Error(`Authentication failed: ${errorDetails}`);
  }
}
async function registerUser(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username,
      password
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    const errorDetails = error.response
      ? `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`
      : error.message;
    console.error('Registration failed:', errorDetails);
    throw new Error(`Registration failed: ${errorDetails}`);
  }
}
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  if (!authToken) {
    await authenticate();
  }
  config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid, re-authenticating...');
      authToken = null; 
      await authenticate(); 
      error.config.headers.Authorization = `Bearer ${authToken}`;
      return api(error.config); 
    }
    throw error;
  }
);

const apiClient = {
  async getUsers() {
    const cacheKey = 'users';
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    
    const response = await api.get('/users');
    cache.set(cacheKey, response.data);
    return response.data;
  },
  
  async getUserPosts(userId) {
    const cacheKey = `posts_${userId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    
    const response = await api.get(`/users/${userId}/posts`);
    cache.set(cacheKey, response.data);
    return response.data;
  },
  
  async getPostComments(postId) {
    const cacheKey = `comments_${postId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    
    const response = await api.get(`/posts/${postId}/comments`);
    cache.set(cacheKey, response.data);
    return response.data;
  }
};

module.exports = apiClient;