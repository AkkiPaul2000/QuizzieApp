// src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Common.css'
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
import CreateQuiz from '../Dashboard/CreateQuiz';
const Sidebar = () => {
  const { isLoggedIn, logout,user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate=useNavigate();
  
  const handleCreateQuizClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleLogout = async (e) => {
    logout()
    toast.dark('Logout successful!');
    Navigate('/login')
  }
  const [selIndex,setSelIndex]=useState(0)
  return (
    <>
    <aside style={{ width: '200px', backgroundColor: '#FFFFFF', color: '#474444', padding: '0px 20px' }}>
      <h2 className='brandName'>QUIZZIE</h2>
      
      <div className='navButtons'>
        <div className={`navButton ${selIndex == 0 ? 'activeLink' : ''}`} onClick={()=>{setSelIndex(0)
          navigate('/dashboard')
        }}>Dashboard</div>
        <div className={`navButton ${selIndex == 1 ? 'activeLink' : ''}`} onClick={()=>{setSelIndex(1)
          navigate('/analytics')
        }}>Analytics</div>
        <div className={`navButton ${selIndex == 2 ? 'activeLink' : ''}`} onClick={handleCreateQuizClick}>Create Quiz</div>
        {console.log(isModalOpen)}
      </div>
      <div className='logOut' onClick={handleLogout}>LOGOUT</div>
    </aside>
    {isModalOpen && <CreateQuiz onClose={handleCloseModal} />}

    </>
  );
};

export default Sidebar;
