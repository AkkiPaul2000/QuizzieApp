import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Quiz.css';
import { BACKEND_URL } from '../../utils/constant';
import prize from '../../assets/prize.svg'; 


function TakeQuiz() {
  const { id } = useParams();
  const quizId = id;
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  

  useEffect(() => {
    // Fetch quiz data using axios 
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/quiz/${quizId}`);
        setQuizData(response.data);
        setTimeRemaining(response.data.questions[0].timer || 0); 
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizId]); // Include quizId in the dependency array

  useEffect(() => {
    const incrementImpression = async () => {
      if (quizData && quizData.questions[currentQuestionIndex]) {
        try {
          // This ensures that we have access to the current question ID
          const currentQuestionId = quizData.questions[currentQuestionIndex]._id;
          console.log(quizId, currentQuestionId);

          // Make your patch request here to increment the impressions
          await axios.patch(`${BACKEND_URL}/api/quiz/${quizId}/question/${currentQuestionId}/impression`);
          console.log("hello",currentQuestionId)

        } catch (error) {
          console.error('Error incrementing impression:', error);
        }
      }
    };

    incrementImpression();
  }, [quizData?.questions?.[currentQuestionIndex]?._id, quizId]);

  useEffect(() => {
    let timerId;
    if (timeRemaining > 0 && quizData && quizData.questions[currentQuestionIndex].timer !== null && !isQuizFinished) {
      timerId = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizData && quizData.questions[currentQuestionIndex].timer !== null && !isQuizFinished) {
      handleSubmit(); // Automatically submit when the timer runs out
    }

    return () => clearInterval(timerId); // Cleanup the timer on unmount or when quiz is finished
  }, [timeRemaining, isQuizFinished, currentQuestionIndex, quizData]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index); // Store the selected answer
  };

  const handleSubmit = async() => {
    if (!quizData) return; // Ensure quiz data is loaded

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.correctAnswer;

    // Store the user's answer
    setUserAnswers([...userAnswers, selectedAnswer]);
    // console.log(currentQuestion)

    try {
      // Increment clicked count for the selected option
      if (selectedAnswer !== null) {
        await axios.patch(`${BACKEND_URL}/api/quiz/increment-option-clicked/${quizId}`, {
          questionIndex: currentQuestionIndex,
          optionIndex: selectedAnswer,
        });
      }

      // ... (rest of your handleSubmit logic for checking answers, updating score, etc.)
    } catch (error) {
      console.error('Error updating quiz stats or fetching next question:', error);
    }
    // Check if the selected answer is correct for Q&A quizzes
    if (quizData.type === 'qna' && selectedAnswer !== null && selectedAnswer.toString() === correctAnswerIndex) {
      try {
        // This ensures that we have access to the current question ID
        const currentQuestionId = quizData.questions[currentQuestionIndex]._id;
        console.log(quizId, currentQuestionId);

        // Make your patch request here to increment the impressions
        await axios.patch(`${BACKEND_URL}/api/quiz/${quizId}/question/${currentQuestionId}/correctAttempt`);
      } catch (error) {
        console.error('Error incrementing impression:', error);
      }
      setScore(score + 1);
    }

    // Move to the next question or finish the quiz
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizData.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null); // Reset selected answer for the next question
      setTimeRemaining(quizData.questions[nextQuestionIndex].timer || 0); // Set new timer
    } else {
      setIsQuizFinished(true); // Finish the quiz
    }
  };

  return (
    <div className="quiz-outerBox">
    <div className="quiz-container">
      {!isQuizFinished && quizData && (
        <div className="quiz-question">
          <div className='takeQuizHeader'>
          <div className='questionIndex'>0{currentQuestionIndex+1}/0{quizData.questions.length}</div>  
          {quizData.questions[currentQuestionIndex].timer !== null && (
            <div className='quizTimer'>00:{timeRemaining}s</div>
          )}
        {/* <div className='quizTimer'>00:{timeRemaining}s</div> */}
          </div>
          
          <div className='currentQues'><span>{quizData.questions[currentQuestionIndex].questionText}</span></div>
          {/* Render options based on the question type */}
          <div className='optionList'>
          {quizData.questions[currentQuestionIndex].type==="text" && quizData.questions[currentQuestionIndex].options.map((option, index) => (
            <div
              key={index}
              className={` textQuiz-option ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {option.text && <span>{option.text}</span>}
              {/* {option.imageUrl && <img src={option.imageUrl} alt={`Option ${index + 1}`} />} */}
            </div>
          ))}
          {quizData.questions[currentQuestionIndex].type==="imageUrl" && quizData.questions[currentQuestionIndex].options.map((option, index) => (
            <div
              key={index}
              className={`imgQuiz-option ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {/* {option.text && <span>{option.text}</span>} */}
              {option.imageUrl && <img src={option.imageUrl} alt={`Option ${index + 1}`} />}
            </div>
          ))}
          {quizData.questions[currentQuestionIndex].type==="both" && quizData.questions[currentQuestionIndex].options.map((option, index) => (
            <div
              key={index}
              className={`bothQuiz-option ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className='bothDisp'>{option.text && <span>{option.text}</span>}
              {option.imageUrl && <img src={option.imageUrl} alt={`Option ${index + 1}`} />}
              </div>
            </div>
          ))}
          
          {/* Display timer if the timer is set for the current question */}
          

          {/* Submit Button */}
          
          </div>
          <div className=" buttonDiv">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
          >
            Submit
          </button>
          </div>
        </div>
      )}

      
      {isQuizFinished && quizData.type === 'qna' && (
        <div className="quiz-result">
          <div className='quizText'>
            <div className="quizHead">Congrats Quiz is completed</div>
            <img src={prize} alt="prize"/>
            <div>Your Score is </div>
            <div className='quizScore'>0{score}/0{quizData.questions.length}</div>
          </div>
        </div>
      )}

      {isQuizFinished && quizData.type === 'poll' && (
        <div className="quiz-result">
          <div className='pollText'>Thank you 
          for participating in the Poll</div>
          
        </div>
      )}
    </div>
    </div>
  );
}

export default TakeQuiz;
