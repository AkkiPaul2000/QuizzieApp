import React, { useState } from 'react';
import { toast } from 'react-toastify';
import "./EditModal.css"

const EditQuizModal = ({ quiz, onSave, onClose }) => {
  const [quizData, setQuizData] = useState(quiz);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleQuestionChange = (e, questionIndex) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex][name] = value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const validateQuizData = () => {
    let newErrors = {};

    if (!quizData.title) {
      newErrors.title = "Quiz title is required.";
    }

    quizData.questions.forEach((question, index) => {
      if (!question.questionText) {
        newErrors[`questionText_${index}`] = "Question text is required.";
      }

      const validOption = question.options.some(
        option => option.text || option.imageUrl
      );
      if (!validOption) {
        newErrors[`options_${index}`] = "At least one valid option is required.";
      }
    });

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateQuizData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors.");
    } else {
      onSave(quizData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Quiz</h2>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={quizData.title}
          onChange={handleInputChange}
        />
        {errors.title && <p className="error">{errors.title}</p>}
        
        <div className="questions-section">
          {quizData.questions.map((question, index) => (
            <div key={index} className="question-item">
              <label>Question Text:</label>
              <input
                type="text"
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(e, index)}
              />
              {errors[`questionText_${index}`] && <p className="error">{errors[`questionText_${index}`]}</p>}
              
              <label>Options:</label>
              {question.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={option.text || option.imageUrl}
                  onChange={(e) => {
                    const updatedOptions = [...question.options];
                    if (question.type === 'text') {
                      updatedOptions[optIndex].text = e.target.value;
                    } else {
                      updatedOptions[optIndex].imageUrl = e.target.value;
                    }
                    const updatedQuestions = [...quizData.questions];
                    updatedQuestions[index].options = updatedOptions;
                    setQuizData({
                      ...quizData,
                      questions: updatedQuestions,
                    });
                  }}
                />
              ))}
              {errors[`options_${index}`] && <p className="error">{errors[`options_${index}`]}</p>}
            </div>
          ))}
        </div>
        
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditQuizModal;
