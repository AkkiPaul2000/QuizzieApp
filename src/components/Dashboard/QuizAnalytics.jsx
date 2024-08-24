import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/auth';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/constant';
import EditQuizModal from './EditQuizModal';
import './Analytics.css';
import share from '../../assets/share.svg'
import bin from '../../assets/bin.svg'
import edit from '../../assets/edit.svg'
import DelConfirm from './modals/DelConfirm';


function QuizAnalytics() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store the quiz being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [delModel, setDelModel] = useState(false);


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
    setSelectedQuiz(quiz);
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

  const handleSaveQuiz = (updatedQuizData) => {
    console.log("updated Modal", updatedQuizData);
    toast.success('Quiz updated successfully!');
    setIsEditModalOpen(false); // Close modal on save
    setDelModel(false)
  };

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
                <td>01 Sep, 2023</td> {/* Replace with dynamic date if available */}
                <td>{quiz.impressions}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  <button className="edit-btn" style={{backgroundColor:'transparent'}}>
                  <img style={{cursor: 'pointer' }} src={edit} alt="edit"/>
                  </button>
                  <button className="delete-btn" onClick={(e)=>handleDelClick(quiz)} style={{backgroundColor:'transparent'}}>
                  <img style={{cursor: 'pointer' }} src={bin} alt="delete"/>
                  </button>
                  <button className="share-btn" style={{backgroundColor:'transparent'}}>
                  <img style={{cursor: 'pointer' }} src={share} alt="share"/>
                  </button>
                  </td>
                  <td>
                  <a href="#" className="analysis-link">
                    Question Wise Analysis
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Quiz Modal */}
      {isEditModalOpen && selectedQuiz && (
        <EditQuizModal quiz={selectedQuiz} onClose={handleCloseEditModal} onSave={handleSaveQuiz} />
      )}
      {delModel && selectedQuiz && (
        <DelConfirm quiz={selectedQuiz} onClose={handleCloseDelModal} onSave={handleSaveQuiz} />
      )}
    </div>
  );
}

export default QuizAnalytics;
