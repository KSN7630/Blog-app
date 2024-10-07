import React, { useEffect, useState } from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/User/userSlice';

export default function DashSidebar() {
    const loaction=useLocation();
    const [tab,setTab] = useState('');
    const dispach=useDispatch();
    const handleSignOut=async ()=>{
      try{
        const res=await fetch(`/api/auth/signout`,{method:'POST'});
        const data=await res.json();
        if(!res.ok){
          console.log(data.message);
        }
        else{
          dispach(signoutSuccess());
        }
      }catch(err){
        console.log(err.message);
      }
    }
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const tabFromUrl=urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    },[loaction.search]);
  return (
    <div>
      <Sidebar className='w-full md:w-56' >
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab=='profile'} icon={HiUser} label={"User"} labelColor='dark' as='div'>Profile</Sidebar.Item>
                </Link>
                <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>Sign-Out</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      
    </div>
  )
}
