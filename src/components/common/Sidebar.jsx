// src/components/common/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Common.css'
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
import CreateQuiz from '../Dashboard/CreateQuiz';
const Sidebar = () => {
  const { isLoggedIn, logout,user } = useAuth();
  const [selIndex,setSelIndex]=useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate=useNavigate();
  
  const handleCreateQuizClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };
  const handleLogout = async (e) => {
    logout()
    toast.dark('Logout successful!');
    Navigate('/login')
  }
  useEffect(() => {
    const currentUrl = window.location.href;

    if (currentUrl.includes('dashboard')) {
      setSelIndex(0);
    } else if (currentUrl.includes('analytics')) { 
      setSelIndex(1);
    } 
    else if (currentUrl.includes('analysis')) { 
      setSelIndex(1);
    } 
    // You can add more conditions here for other routes if needed
  }, []); // Empty dependency array ensures this runs only once on mount
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
