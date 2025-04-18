import { useState, useEffect } from 'react';
import axios from 'axios';

function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setLoading(false);
      }
    };
    fetchTopUsers();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Top Users</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <img
              src={`https://picsum.photos/200?random=${user.id}`}
              alt="Profile"
              className="w-16 h-16 rounded-full mb-2"
            />
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p>Total Comments: {user.totalComments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopUsers;