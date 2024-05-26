import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/api';

const SlackAuth = () => {
  const [userData, setUserData] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
    // Check if the current URL contains the Slack OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchUserDataAndChannels();
    }
  }, []);

  const initiateSlackAuth = () => {
    // Redirect the user to the server-side route for initiating the Slack OAuth flow
    window.location.href = '/slack/oauth';
  };

  const fetchUserDataAndChannels = async () => {
    try {
      const response = await api.get('/slack/user-data');
      setUserData(response.data.user);
      setChannels(response.data.channels);
    } catch (error) {
      console.error('Error fetching user data and channels:', error);
    }
  };

  const handleChannelSelect = (channelId) => {
    setSelectedChannels((prevSelectedChannels) => {
      if (prevSelectedChannels.includes(channelId)) {
        return prevSelectedChannels.filter((id) => id !== channelId);
      } else {
        return [...prevSelectedChannels, channelId];
      }
    });
  };

  return (
    <div>
      <a href="http://localhost:3000/slack/oauth"><button >Connect to Slack</button></a>
      {userData && (
        <div>
          <h2>User Data</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
      {channels.length > 0 && (
        <div>
          <h2>Public Channels</h2>
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
        </div>
      )}
      <button onClick={fetchUserDataAndChannels}>Fetch User Data and Channels</button>
    </div>
  );
};

export default SlackAuth;