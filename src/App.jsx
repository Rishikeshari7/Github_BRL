import React, { useState } from 'react';
import Loader from './Loader';
import './App.css';
import Nav from "./nav"
function App() {
  const [username,setUsername] =useState('');
  const [userData,setUserData] =useState(null);
  const [followersData,setFollowersData] =useState([]);
  const [name , setName]=useState('');
  const [bio,setBio] =useState('');
  const [location,setLocation] =useState('');
  const [social,setSocial] =useState('');
  const [createdAt,setCreatedAt] =useState('');
  const [publicRepos,setPublicRepos] =useState(0);
  const [publicGists,setPublicGists] =useState(0);
  const [following,setFollowing] =useState(0);
  const [followers,setFollowers] =useState(0);
  const [loading,setLoading]=useState(false);
  const [organizations,setOrganizations] =useState([]);
  const [starRepos,setStarredRepos]=useState([]);
  const [page,setPage]=useState(1);
  const perPage=5;

  async function fetchData(url){
    try{
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log("error in fetch")
    }
  }

  async function fetchGitHubUserData(){
    const apiURL = `https://api.github.com/users/${username}`;
    setLoading(true);
    try{
      const userData = await fetchData(apiURL);
      showUserDetails(userData);
      await fetchFollowers(username);
      await fetchOrganisation(username);
      await fetchStarRepo(username);
    } catch (error) {
      console.log("error");
    }
    finally{
      setLoading(false);
    }
  }<span></span>

  async function fetchFollowers(username){
    const followersDataURL = `https://api.github.com/users/${username}/followers`;
    const data = await fetchData(followersDataURL);
    setFollowersData(data);
  }
  async function fetchOrganisation(username){
    const orgURL= `https://api.github.com/users/${username}/orgs`;
    const orgData= await fetchData(orgURL);
    setOrganizations(orgData);

  }
  async function fetchStarRepo(username){
    const starRepoURL=`https://api.github.com/users/${username}/starred`
    const starData= await fetchData(starRepoURL);
    setStarredRepos(starData);
  }

  function showUserDetails(userData){
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
  const finalIndex= page*perPage;
  const initialIndex=finalIndex-perPage;
  const showFollower=followersData.slice(initialIndex,finalIndex);
  const totalPage=Math.ceil( followersData.length/perPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  return (
    <>
    <label htmlFor="username">Fetch With Cathch GitHub </label>
    <div className="app">
      
      <input type="text" id="username" onChange={(e) => setUsername(e.target.value)}/>
      <button onClick={fetchGitHubUserData}>Fetch Data</button>
      {loading ? <Loader/>:null}
      {userData && (
        <div id="user-details">
          <h2>• User Details </h2>
          <a href={userData.html_url} target="_blank"><img  src={userData.avatar_url} alt="img" /></a>
          <h3>⦾ {userData.name || userData.login}</h3>
          <p><span className="userNameBio">Bio:</span> {bio}</p>
          <p><span className="userNameBio">Location:</span> {location}</p>
          <p><span className="userNameBio">Social:</span> {social}</p>
          <p><span className="userNameBio">Joined GitHub on:</span> {createdAt}</p>
          <p><span className="userNameBio">Public Repositories:</span> {publicRepos}</p>
          <p><span className="userNameBio">Public Gists:</span> {publicGists}</p>
          <p><span className="userNameBio">Following:</span> {following}</p>
          <p><span className="userNameBio">Followers:</span> {followers}</p>
          <p><span  className="userNameBio"><strong>Organisation:</strong></span> {organizations.length} </p>
          {/* <p>Starred Repositories: {starRepos.lenght}</p> */}
          
        </div>
      )}
      {/* {organizations.length===0 && <h3>Create Organisation first</h3>} */}
      {organizations.length>0 && (
            <div className='orgsContainer'>
            <hr/> 
              <h2>Organisations Name</h2>
              <ul className='orgsContainerinner'> 
              {organizations.map((orgs)=>(
                <p key={orgs.id}>~ {orgs.login}</p>
              ))}
              </ul>
            </div>
        )}
      
    </div>
    { followersData.length>0 && (
    <div className='followerContainer'>
      <div id="followersList">
        {showFollower.map(follower => (
          <div key={follower.id} className="follower-item">
            <a  href={follower.html_url}  target="_blank" ><img src={follower.avatar_url}/></a>
            <p>{follower.login}</p>
            
          </div>
        ))}
        
      </div>
      <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} >Previous</button>
            <span>Page {page} of {totalPage}</span>
            <button onClick={() => handlePageChange(page + 1)} >Next</button>
          </div>
          
    </div>)}
    
 
      <div >
      
          {starRepos.length>0 && (
            
            <div className='starRepoContainer'>
            
              <h2>Starred Repositories </h2>
              <hr></hr>
              <div className='starRepoInner'>
              {starRepos.map((repo)=>(
                <span key={repo.id}><a href={repo.html_url} target="_blank" > ~ {repo.name}</a> </span>
              
              ))}
              </div>
            </div>
          )}
      </div>

    
    {/* <Nav/> */}
    </>
  );
}

export default App;
