import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/login/success', {
          withCredentials: true,
        });
        console.log(response);
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!user ? (
        <div className="space-y-4">
          <a href="http://localhost:3000/auth/google">
            <button className="px-6 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700 transition duration-300">
              Log in to Google
            </button>
          </a>
          
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
          <img className="w-24 h-24 rounded-full mb-4" src={user.image} alt={user.displayName} />
          <h1 className="text-2xl font-semibold">{user.displayName}</h1>
          <p className="text-gray-600">{user.email}</p>
          <a href="http://localhost:3000/logout" className="mt-6">
            <button className="px-6 py-2 bg-red-500 text-white rounded shadow-lg hover:bg-red-700 transition duration-300">
              Logout
            </button>
          </a>
          <a href="http://localhost:3000/slack/oauth">
            <button className="px-6 py-2 bg-green-500 text-white rounded shadow-lg hover:bg-green-700 transition duration-300">
              Connect with Slack
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
