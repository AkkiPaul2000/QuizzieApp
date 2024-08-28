import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL, FRONTEND_URL } from '../../utils/constant';
import './Analytics.css';
import share from '../../assets/share.svg'
import bin from '../../assets/bin.svg'
import edit from '../../assets/edit.svg'
import DelConfirm from './modals/DelConfirm';
import { Link } from 'react-router-dom';
import EditQuiz from './EditQuiz';


function QuizAnalytics() {
  const { user,loading } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store the quiz being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [delModel, setDelModel] = useState(false);
  const handleShareClick = (id) => {
    const Link=`${FRONTEND_URL}${id}`;
    navigator.clipboard.writeText(Link)
    .then(() => {
        toast.success('Link copied to clipboard!', {
          autoClose: 2000, // Auto-close after 2 seconds
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy link. Please try again.');
      });

  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/quiz/my-quizzes`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setQuizzes(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.error || 'Failed to fetch quizzes');
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const handleEditClick = (quiz) => {
    setSelectedQuiz(quiz); // Pass the entire quiz object
    setIsEditModalOpen(true);
  };
  const handleDelClick = (quiz) => {
    setSelectedQuiz(quiz);
    setDelModel(true);
  };
  const handleCloseDelModal = () => {
    setDelModel(false);
    setSelectedQuiz(null);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuiz(null);
  };
  const handleDeleteQuiz = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/quiz/delete/${selectedQuiz}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });

      // Update the quiz list after successful deletion
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== selectedQuiz));
      toast.success('Quiz deleted successfully!');
      handleCloseDelModal(); // Close the delete confirmation modal
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete quiz');
    }
  };
  const handleSaveQuiz = (updatedQuizData) => {
    console.log("updated Modal", updatedQuizData);
    toast.success('Quiz updated successfully!');
    setIsEditModalOpen(false); // Close modal on save
    setDelModel(false)
  };

  const convertDate=(number)=>{
    const createdAtDate = new Date(number);
  const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short', // Use 'short' for abbreviated month name
    year: 'numeric'
  });
  return formattedDate;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="quizAnalytics">
      <h1>Quiz Analytics</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes && quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{convertDate(quiz.createdAt)}</td> {/* Replace with dynamic date if available */}
                <td>{quiz.impressions}</td>
                <td style={{whiteSpace:'nowrap'}}>
                <button 
                className="edit-btn" 
                style={{ backgroundColor: 'transparent' }} 
                onClick={() => handleEditClick(quiz)} // Pass the quiz object
              >
                  <img style={{cursor: 'pointer' }} src={edit} alt="edit"/>
                  </button>
                  <button className="delete-btn" onClick={(e)=>handleDelClick(quiz._id)} style={{backgroundColor:'transparent'}}>
                  <img style={{cursor: 'pointer' }} src={bin} alt="delete"/>
                  </button>
                  <button className="share-btn" onClick={()=>handleShareClick(quiz._id)} style={{backgroundColor:'transparent'}}>
                  <img style={{cursor: 'pointer' }} src={share} alt="share"/>
                  </button>
                  </td>
                  <td>
                  <Link
                    to={`/analytics/${quiz._id}`}
                    className="analysis-link"
                    
                  >
                    Question Wise Analysis
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Quiz Modal */}
      
      {isEditModalOpen && selectedQuiz && ( 
        <EditQuiz quiz={selectedQuiz} onClose={handleCloseEditModal} onSave={handleSaveQuiz} />
      )}
      {delModel && selectedQuiz && (
        <DelConfirm quiz={selectedQuiz} onClose={handleCloseDelModal} onDelete={handleDeleteQuiz} />
      )}
    </div>
  );
}

export default QuizAnalytics;
