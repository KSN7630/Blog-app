import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar.jsx';
import DashProfile from '../components/DashProfile.jsx';
import DashPosts from '../components/DashPosts.jsx';
import DashUsers from '../components/DashUsers.jsx';
import DashComments from '../components/DashComments.jsx';

export default function Dashboard() {
  const loaction=useLocation();
  const [tab,setTab] = useState('');
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[loaction.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSidebar/>
      </div>
    
      {tab==='profile' && <DashProfile/>}
      {tab==='posts' && <DashPosts/>}
      {tab==='users' && <DashUsers/>}
      {tab==='comments' && <DashComments/>}
    </div>
  )
}
