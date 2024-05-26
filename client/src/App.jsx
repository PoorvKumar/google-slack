import React, { useEffect, useState } from 'react';
import api from "./api/api";

const App = () => {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [slackConneceted,setSlackConnected]=useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/login/success', {
          withCredentials: true,
        });
        console.log(response);
        setUser(response.data.user);
        setSlackConnected(response.data.isSlackConnected);
      } catch (err) {
        console.log("Not Logged in");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await api.get('/slack/channels');
        setChannels(response.data.channels);
      } catch (err) {
        console.error('Error fetching channels:', err);
      }
    };
    if (user) {
      // fetchChannels();
    }
  }, [user]);

  const handleChannelSelect = (channelId) => {
    setSelectedChannels((prevSelectedChannels) => {
      if (prevSelectedChannels.includes(channelId)) {
        return prevSelectedChannels.filter((id) => id !== channelId);
      } else {
        return [...prevSelectedChannels, channelId];
      }
    });
  };

  const sendUserDetailsToChannels = async () => {
    try {
      await api.post('/slack/send-user-details', { channelIds: selectedChannels });
      console.log('User details sent to selected channels');
    } catch (err) {
      console.error('Error sending user details to channels:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>

      {!user ? (
        <a href="http://localhost:3000/auth/google" >
          <button className='p-2 rounded-lg bg-green-200 border hover:bg-blue-300 hover:text-white'>Login with Google</button>
        </a>
      ) : (
        <div className='h-[100vh] w-full bg-gray-100 flex items-center justify-center relative'>
          <div className='flex gap-4 top-4 absolute'>
            <a href="http://localhost:3000/logout" >
              <button className='p-2 rounded-lg border bg-white hover:bg-red-100'>Logout</button>
            </a>
            {!slackConneceted && (
              <a href="http://localhost:3000/slack/oauth" >
              <button className='p-2 rounded-lg border bg-white hover:bg-yellow-100'>Connect with Slack</button>
            </a>
            )}
          </div>
          <div className='flex gap-4'>
            <img src={user.image || "./vite.svg"} />
            <div className='flex flex-col gap-3'>
              <h1 className='text-2xl font-bold '>{user.displayName}</h1>
              <h3 className='text-xl '>{user.email}</h3>
            </div>
            {channels.length > 0 && (
            <div className='absolute bottom-4'>
              <h2 className='mb-2'>Public Channels</h2>
              <ul>
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel.id)}
                        onChange={() => handleChannelSelect(channel.id)}
                      />
                      {channel.name}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                onClick={sendUserDetailsToChannels}
                disabled={selectedChannels.length === 0}
                className='mt-2 p-2 rounded-lg border bg-white hover:bg-green-100'
              >
                Send User Details to Selected Channels
              </button>
            </div>
          )}
          </div>
        </div>
      )}

    </div>
  )
}

export default App;