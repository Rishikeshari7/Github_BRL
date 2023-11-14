import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [social, setSocial] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [publicRepos, setPublicRepos] = useState(0);
  const [publicGists, setPublicGists] = useState(0);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log("error in fetch")
    }
  }

  async function fetchGitHubData() {
    const apiURL = `https://api.github.com/users/${username}`;

    try {
      const userData = await fetchData(apiURL);
      showUserDetails(userData);
      await fetchFollowers(username);
    } catch (error) {
      console.log("error");
    }
  }

  async function fetchFollowers(username) {
    const followersEndpoint = `https://api.github.com/users/${username}/followers`;
    const data = await fetchData(followersEndpoint);
    setFollowersData(data);
  }

  function showUserDetails(userData) {
    setUserData(userData);
    setBio(userData.bio || 'No bio available');
    setLocation(userData.location || 'Not specified');
    setSocial(userData.blog || 'No social media link');
    setCreatedAt(new Date(userData.created_at).toLocaleDateString('en-GB'));
    setPublicRepos(userData.public_repos);
    setPublicGists(userData.public_gists);
    setFollowing(userData.following);
    setFollowers(userData.followers);
  }

 

  return (
    <div id="app">
      <label htmlFor="username">Enter GitHub Username:</label>
      <input type="text" id="username" onChange={(e) => setUsername(e.target.value)}/>
      <button onClick={fetchGitHubData}>Fetch Data</button>

      {userData && (
        <div id="user-details">
          <h2>User Details</h2>
          <img src={userData.avatar_url} alt="img" />
          <h3>{userData.name}</h3>
          <p>Bio: {bio}</p>
          <p>Location: {location}</p>
          <p>Social: {social}</p>
          <p>Joined GitHub on: {createdAt}</p>
          <p>Public Repositories: {publicRepos}</p>
          <p>Public Gists: {publicGists}</p>
          <p>Following: {following}</p>
          <p>Followers: {followers}</p>
        </div>
      )}

      <div id="followersList">
        {followersData.map(follower => (
          <div key={follower.id} className="follower-item">
            <img src={follower.avatar_url}/>
            <p>{follower.login}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
