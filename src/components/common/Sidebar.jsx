// src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Common.css'
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
const Sidebar = () => {
  const { logout } = useAuth();
  const handleLogout = async (e) => {
    logout()
    toast.dark('Logout successful!');
    Navigate('/login')
  }
  const [selIndex,setSelIndex]=useState(0)
  return (
    <aside style={{ width: '200px', backgroundColor: '#FFFFFF', color: '#474444', padding: '0px 20px' }}>
      <h2 className='brandName'>QUIZZIE</h2>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Link to="/dashboard" className={selIndex==0?'activeLink':''} onClick={()=>setSelIndex(0)}>Dashboard</Link></li>
          <li><Link to="/createQuiz" className={selIndex==1?'activeLink':''} onClick={()=>setSelIndex(1)}>Create Quiz</Link></li>
          <li><Link to="/analytics" className={selIndex==2?'activeLink':''} onClick={()=>setSelIndex(2)}>Quiz Analytics</Link></li>
        </ul>
      </nav>
      <div className='logOut' onClick={handleLogout}>LOGOUT</div>
    </aside>
  );
};

export default Sidebar;
