import { useState, useEffect } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts?type=latest');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
    const interval = setInterval(fetchLatestPosts, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Live Feed</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded shadow">
            <img
              src={`https://picsum.photos/300/200?random=${post.id}`}
              alt="Post"
              className="w-full h-48 object-cover rounded mb-2"
            />
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;