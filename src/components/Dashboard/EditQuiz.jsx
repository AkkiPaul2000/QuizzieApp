import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/constant';
import './CreateQuiz.css'; // You might want to create a separate CSS file for editing
// import plus from '../../assets/plus.svg';
// import bin from '../../assets/bin.svg';
// import cross from '../../assets/cross.svg';

const EditQuiz = ({ quiz, onClose, onSave }) => {
  const [quizData, setQuizData] = useState({ ...quiz }); // Initialize with the quiz data
  const [quizIndex, setQuizIndex] = useState(0);
  const [optionType, setOptionType] = useState(quiz.questions[0].type || 'text');
  const handleQuestionTextChange = (questionIndex, newQuestionText) => {
    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].questionText = newQuestionText;
      return { ...prevQuizData, questions: updatedQuestions };
    });
  };

  
  const currentOptionsLength = quizData.questions[quizIndex].options.length;


  const handleCorrectAnswerChange = (questionIndex, newCorrectAnswer) => {
    // console.log(questionIndex,newCorrectAnswer)
    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].correctAnswer = newCorrectAnswer;
      return { ...prevQuizData, questions: updatedQuestions };
    });
  };

  const handleClose=()=>{
    
    setQuizData({
      title: '',
      type: 'qna', 
      questions: [
        { questionText: '', options: [{ text: '', imageUrl: '' }, { text: '', imageUrl: '' }], correctAnswer: 0, timer: null,type:"text" },
      ],
    })
    onClose();


  }
  const handleQuestionNavigate = (newIndex) => {
    // Ensure the newIndex is within bounds
    const validIndex = Math.max(0, Math.min(newIndex, quizData.questions.length - 1));
    setQuizIndex(validIndex);

    // Update optionType based on the navigated question
    setOptionType(quizData.questions[validIndex].type || 'text');
  };

  const handleOptionType=(e,questionIndex)=>{
    setOptionType(e.target.value)
    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].type = e.target.value; 
      return { ...prevQuizData, questions: updatedQuestions };
    });
  }

  const handleTimerChange = (e,questionIndex, newTimerValue) => {
    e.preventDefault();

    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].timer = newTimerValue;
      return { ...prevQuizData, questions: updatedQuestions };
    });
  };
  
  
  const handleInputChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };
  const handleOptionTextChange = (questionIndex, optionIndex, newOptionText,type) => {
    if(type=="text"){
    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].options[optionIndex].text = newOptionText;
      return { ...prevQuizData, questions: updatedQuestions };
    });}
    if(type=="imageUrl"){
      setQuizData(prevQuizData => {
        const updatedQuestions = [...prevQuizData.questions];
        updatedQuestions[questionIndex].options[optionIndex].imageUrl = newOptionText;
        return { ...prevQuizData, questions: updatedQuestions };
      });}
  };  
  const handleAddOption = () => {
  
    if (quizData.questions[quizIndex].options.length < 4) { 
      setQuizData(prevQuizData => ({
        ...prevQuizData,
        questions: prevQuizData.questions.map((question, index) => 
          index === quizIndex 
            ? { ...question, options: [...question.options,{ text: '', imageUrl: '' }] } 
            : question
        )
      }));
    } else {
      toast.warning('You can only have a maximum of 4 options per question.');
    }
  };
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    if (quizData.questions.length < 5) { 
      setQuizData({
        ...quizData,
        questions: [
          ...quizData.questions,
          { questionText: '', options: [{ text: '', imageUrl: '' }, { text: '', imageUrl: '' }], correctAnswer: 0, timer: null,type: 'text' },
        ],
      });
    } else {
      toast.warning('You can only have a maximum of 5 questions.');
    }
  };

  const handleRemoveQuestion = (index) => {
    // console.log(quizData)
    // console.log(index)
    setQuizIndex(index-1)

    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setQuizData(prevQuizData => {
      const updatedQuestions = prevQuizData.questions.map((question, index) => {
        if (index === questionIndex) {
          const updatedOptions = [...question.options];
          updatedOptions.splice(optionIndex, 1); // Remove the option at the specified index
          return {
            ...question,
            options: updatedOptions 
          };
        }
        return question;
      });
      return { ...prevQuizData, questions: updatedQuestions };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(quizData)

    let isValid = true; // Flag to track validation status
  
    // Check if correctAnswer is within the bounds of options
    quizData.questions.forEach((ques) => {
      if (ques.options.length - 1 < ques.correctAnswer) {
        toast.error('Check your answers - Correct answer index is out of bounds.');
        console.log("Error0")
        isValid = false; // Set the flag to false if there's an error
      }
    });
  
    // Other validation checks (title, questionText, empty options)
    if (!quizData.title || quizData.questions.some(q => !q.questionText)) {
      toast.error('Please fill in all required fields.');
      console.log("Error1")
      isValid = false;
    }
  var condion1=false;
    var hasEmptyOptions = quizData.questions.some(question => 
      question.options.some(option => option.text.trim() === '' && option.imageUrl.trim() === '')
    );
    console.log("Error1",hasEmptyOptions,condion1)

    quizData.questions.map(question => {
      console.log("error check",question)
        if(question.type==="text"){
          question.options.map(option=>{console.log("error check1",option);if(option.text.trim() === ''){condion1=true}})
        }
        if (question.type === "imageUrl") {
          question.options.map(option => {
              console.log("error check1", option);
      
              // Check if imageUrl is empty after trimming
              if (option.imageUrl.trim() === '') {
                  condion1 = true; 
              } 
          });
      }
      if (question.type === "both") {
        question.options.map(option => {
          console.log("error check1", option);
      
          // Check if either text or imageUrl is empty after trimming
          if (option.text.trim() === '' || option.imageUrl.trim() === '') {
            condion1 = true; 
          } 
      
          // Check if imageUrl is present and valid
          if (option.imageUrl.trim() !== '') { 
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            if (!urlPattern.test(option.imageUrl)) {
              console.log("Invalid URL:", option.imageUrl);
              condion1 = true; 
              toast.error('Fill up the URL correctly'); 
            }
          }
        });
      }
  });
   
    
    
    console.log("Error2",hasEmptyOptions,condion1)
    if (hasEmptyOptions || condion1) {
      toast.error('Please fill in all option fields.');
      isValid = false;
    }
    console.log("Error6",hasEmptyOptions)

    if (isValid) {
      try {
        const response = await axios.patch(`${BACKEND_URL}/api/quiz/edit/${quiz._id}`, {
          questions: quizData.questions, 
        }, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        onSave(response.data); // Call the onSave callback with the updated quiz data
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to update quiz');
      }
    }
  };

  return (
    <div className="modal">
      <div className="content" style={{flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'flex-start'}}><h2>Edit Quiz</h2> {/* Change the heading */}
        <div className='quizList'>
            {/* number section */}
            <div className='indexGrp' style={{display:'flex',flexDirection:'row'}}>
              {quizData.questions.map((question, index) => (
                <div className='quizIndex' key={index}>
                  <span
                    style={{ cursor: 'pointer',padding:10 }}
                    onClick={() => handleQuestionNavigate(index)}
                    className={quizIndex === index ? 'activeQuestion' : ''} // Add active class
                  >
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
            </div>
            </div>
        <form onSubmit={handleSubmit}>
          {quiz&& (
            <div className='quizList'>
              {/* ... number section (similar to CreateQuiz) */}

              {/* QNA/Poll Question */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  id="title"
                  name="title"
                  value={quizData.questions[quizIndex].questionText}
                  onChange={(e) => handleQuestionTextChange(quizIndex, e.target.value)}
                  placeholder={`${quizData.type} Question`}
                  required
                  className='quizName'
                  style={{ height: '2.5rem' }}
                />
              </div>

              {/* detail section */}
              {/* detail section */}
              <div className='quizDetails'>
                {/* Option Type */}
                <div className='typeButton1'>
                  <label htmlFor="type" style={{ whiteSpace: 'nowrap' }}>Option Type</label>

                  {/* Disable option type radio buttons */}
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="type"
                      value="text"
                      checked={optionType === 'text'}
                      onChange={(e) => toast.warning("You can't change the option type while editing.")}
                      disabled
                    />
                    <div className="radio-button" style={{ marginLeft: '5px' }}>Text</div>
                  </label>

                  {/* Image URL */}
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="type"
                      value="imageUrl"
                      checked={optionType === 'imageUrl'}
                      onChange={(e) => toast.warning("You can't change the option type while editing.")}
                      disabled
                    />
                    <div className="radio-button" style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>Image URL</div>
                  </label>

                  {/* Text & Image URL */}
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="type"
                      value="both"
                      checked={optionType === 'both'}
                      onChange={(e) => toast.warning("You can't change the option type while editing.")}
                      disabled
                    />
                    <div className="radio-button" style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>Text & Image URL</div>
                  </label>
                </div> {/* End of .typeButton1 */}
              </div> {/* End of .quizDetails */}
              {/* Conditional input rendering */}
              {/* Text */}
              {quizData.type === 'qna' && (
                <div className='typeFields'>
                  <div className='optionGroup'>
                    {optionType === "text" && (
                      <div className='options'>
                        {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                          <div className='option' key={optionIndex}>
                            
                            <label key={optionIndex}>
                              <input
                                type="radio"
                                name={`question-${quizIndex}-options`}
                                value={optionIndex}
                                checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                                onChange={() => toast.warning("You can't change the correct answer while editing.")}
                                disabled // Disable changing the correct answer
                              />
                              <span className="radio-button">
                                <input
                                  type="text"
                                  value={opt.text}
                                  style={{ 
                                    backgroundColor: quizData.questions[quizIndex].correctAnswer == optionIndex ? '#60B84B' : 'white', 
                                    color: quizData.questions[quizIndex].correctAnswer == optionIndex ? 'white' : '#474444' 
                                  }} 
                                  onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "text")}
                                />
                              </span>
                              {/* Disable removing options */}
                            </label>
                          </div>
                        ))}
                        {/* Disable adding options */}
                      </div>
                    )}
                    {optionType === "imageUrl" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        <div className='option' key={optionIndex}>
                          <label key={optionIndex}>
                            {quizData.type === 'qna' && ( 
                              <input
                                type="radio"
                                name={`question-${quizIndex}-options`}
                                value={optionIndex}
                                checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                                onChange={() => toast.warning("You can't change the correct answer while editing.")}
                                disabled 
                              />
                            )}
                            <span className="radio-button">
                              <input
                                type="url"
                                value={opt.imageUrl}
                                style={{ 
                                    backgroundColor: quizData.questions[quizIndex].correctAnswer == optionIndex ? '#60B84B' : 'white', 
                                    color: quizData.questions[quizIndex].correctAnswer == optionIndex ? 'white' : '#474444' 
                                  }} 
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "imageUrl")}
                                placeholder="Enter image URL"
                              />
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {optionType === "both" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        
                        <div className='option' key={optionIndex}>
                            
                          <label key={optionIndex}>
                            {quizData.type === 'qna' && (
                              <input
                                type="radio"
                                name={`question-${quizIndex}-options`}
                                value={optionIndex}
                                checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                                onChange={() => toast.warning("You can't change the correct answer while editing.")}
                                disabled
                              />
                            )}
                            <span className="radio-button">
                              <input
                                type="text"
                                value={opt.text}
                                style={{ 
                                    backgroundColor: quizData.questions[quizIndex].correctAnswer == optionIndex ? '#60B84B' : 'white', 
                                    color: quizData.questions[quizIndex].correctAnswer == optionIndex ? 'white' : '#474444' 
                                  }} 
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "text")}
                              />
                            </span>
                            <span className="radio-button">
                              <input
                                type="url" 
                                value={opt.imageUrl}
                                style={{ 
                                    backgroundColor: quizData.questions[quizIndex].correctAnswer == optionIndex ? '#60B84B' : 'white', 
                                    color: quizData.questions[quizIndex].correctAnswer == optionIndex ? 'white' : '#474444' 
                                  }} 
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "imageUrl")}
                                placeholder="Enter image URL"
                              />
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                    {/* Image URL and Both options - similar handling for radio buttons and add/remove options */}
                    {/* ... */}
                  </div>

                  {/* Timer section */}
                  {quizData.type === 'qna' && (
                    <div className='timers' style={{display:'flex', flexDirection:'column',alignItems:'center',marginTop:20}}>
                        <span>Timer</span>
                        <button style={{margin:5}} className={quizData.questions[quizIndex].timer == null ? 'timer-active' : ''}
                        onClick={(e) => handleTimerChange(e, quizIndex, null)}
                        >
                        OFF
                        </button>
                        <button style={{margin:5}} className={quizData.questions[quizIndex].timer == 5 ? 'timer-active' : ''}
                        onClick={(e) => handleTimerChange(e, quizIndex, 5)}
                        >
                        5sec
                        </button>
                        <button style={{margin:5}} className={quizData.questions[quizIndex].timer == 10 ? 'timer-active' : ''}
                        onClick={(e) => handleTimerChange(e, quizIndex, 10)}
                        >
                        10sec
                        </button>
                    </div>
                    )}
                </div>
              )}

              {quizData.type === 'poll' && ( 
                <div className='typeFields'>
                   <div className='optionGroup'>
                    {/* Text options for Poll type */}
                    {optionType === "text" && (
                      <div className='options'>
                        {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                          <div className='option' key={optionIndex}>
                            <label key={optionIndex}>
                              <span className="radio-button">
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "text")}
                                />
                              </span> 
                              {/* Disable removing options */}
                            </label>
                          </div>
                        ))}
                        {/* Disable adding options */}
                      </div>
                    )}

                    {/* Image URL options for Poll type */}
                    {optionType === "imageUrl" && (
                      <div className='options'>
                        {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                          <div className='option' key={optionIndex}>
                            <label key={optionIndex}>
                              <span className="radio-button">
                                <input
                                  type="url"
                                  value={opt.imageUrl}
                                  onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "imageUrl")}
                                  placeholder="Enter image URL"
                                />
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Both (Text & Image URL) options for Poll type */}
                    {optionType === "both" && (
                      <div className='options'>
                        {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                          <div className='option' key={optionIndex}>
                            <label key={optionIndex}>
                              <span className="radio-button">
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "text")}
                                />
                              </span> 
                              <span className="radio-button">
                                <input 
                                  type="url" 
                                  value={opt.imageUrl}
                                  onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value, "imageUrl")}
                                  placeholder="Enter image URL"
                                />
                              </span> 
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> {/* End of .optionGroup */}
                </div>
              )}

              <div className='buttons'>
                <button onClick={handleClose} className='cancel'>Cancel</button>
                <button className='createQuiz' type="submit">Save Quiz</button> {/* Change button text */}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;