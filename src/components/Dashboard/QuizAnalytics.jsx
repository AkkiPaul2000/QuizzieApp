import React, { useEffect, useState } from 'react'
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/constant';
import EditQuizModal from './EditQuizModal';

function QuizAnalytics() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store the quiz being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/quiz/my-quizzes`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setQuizzes(response.data);
        console.log(response.data)

      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.error || 'Failed to fetch quizzes');
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const handleEditClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuiz(null);
  };
  const handleSaveQuiz = (updatedQuizData) => {
    // setQuizList(prevQuizList => {
    //   const updatedQuizList = [...prevQuizList];
    //   const index = updatedQuizList.findIndex(quiz => quiz.title === updatedQuizData.title);
    //   updatedQuizList[index] = updatedQuizData;
    //   return updatedQuizList;
    // });
    console.log("updated Modal",updatedQuizData)
    toast.success('Quiz updated successfully!');
    setShowEditModal(false);
  };

  return (
    <div className='quizAnalytics'>
      <h1>Quiz Analytics</h1>
      <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Quiz Name</th>
        <th>Created on</th>
        <th>Impression</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {quizzes && quizzes.map((quiz, index) => (
            <tr key={quiz._id}>
              <td>{index + 1}</td>
              <td>{quiz.title}</td>
              <td>01 Sep, 2023</td>
              <td>{quiz.impressions}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(quiz)}>
                  Edit
                </button>
                <button className="share-btn">Share</button>
                <a href="#" className="analysis-link">
                  Question Wise Analysis
                </a>
              </td>
            </tr>
          ))}
      
      
      </tbody>
  </table>
   {/* Edit Quiz Modal */}
   {isEditModalOpen && selectedQuiz && (
        <EditQuizModal quiz={selectedQuiz} onClose={handleCloseModal} onSave={handleSaveQuiz} />
      )}
    </div>
  )
}

export default QuizAnalytics