import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/constant';
import eye from '../../assets/eye.svg'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth();
  const [statState, setStatState] = useState({
    quizCreated: 0,
    questionCreated: 0,
    impression: 0,
  });
  const [myTrendingQuizzes, setMyTrendingQuizzes] = useState([])

  useEffect(() => {
    const fetchQuizzesAndCalculateStats = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/quiz/my-quizzes`, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        // Calculate statistics directly after fetching quizzes
        const newStats = {
          quizCreated: response.data.length,
          questionCreated: response.data.reduce((total, quiz) => total + quiz.questions.length, 0),
          impression: response.data.reduce((total, quiz) => total + quiz.impressions, 0),
        };
        setStatState(newStats);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch quizzes');
      }
    };

    if (user) {
      fetchQuizzesAndCalculateStats();
    }
  }, [user]); // Dependency on 'user' remains
  useEffect(() => {
    const fetchMyTrendingQuizzes = async () => {
      try {
        // Assuming you have the userId you want to fetch trending quizzes for
        const userIdToFetch = user.userId; // Or any other userId you want
  
        const response = await axios.get(`${BACKEND_URL}/api/quiz/my-trending/${userIdToFetch}`, {
          headers: { Authorization: localStorage.getItem('token') }, 
        });
        setMyTrendingQuizzes(response.data);
        console.log(response.data)

      } catch (error) {
        console.log("server Crashed")
      }
    };
  
    if (user) { 
      fetchMyTrendingQuizzes();
    }
  }, [user]);
  // ... (Add functions to handle quiz creation, sharing, etc. later)

  return (
    <div className='dashboardPage'>
      <div className='statGrid'>
      <div className='stats'>
        
        <div className='data-container'> 
          <span className='data'>{statState.quizCreated}</span> 
          <span className='data-label'>Quizzes</span>
        </div>
        <div className='nLine'>Created </div>
      </div>
      <div className='stats'>
        <div className='data-container'> 
          <span className='data'>{statState.questionCreated}</span> 
          <span className='data-label'>Questions</span>
        </div>
        <div className='nLine'>Created </div>
      </div>
        <div className='stats'>
          <div className='data-container'> 
            <span className='data'>{statState.impression > 1000 
    ? `${(statState.impression / 1000).toFixed(1)}K` 
    : statState.impression
  }</span> 
            <span className='data-label'>Total</span>
          </div>
          <div className='nLine'>Impressions </div>
        </div>
      </div>  

      <div className='TrendingQuiz'>
        <div><h1>Trending Quizs</h1></div>
      <div className='trendQuizGrp'>
      {myTrendingQuizzes.map(quiz => {
        const createdAtDate = new Date(quiz.createdAt);
        const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short', // Use 'short' for abbreviated month name
          year: 'numeric'
        });

        return (
            <div className='trendQuiz'>
              <div className='trendHead'>
                <div>{quiz.title}</div>
                <div className='views'>{quiz.impressions}<img src={eye} alt="views" /></div>
              </div>
              <div className='createdOn'>Created on : {formattedDate}</div> {/* Display formatted date */}
            </div>
        );
      })}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;