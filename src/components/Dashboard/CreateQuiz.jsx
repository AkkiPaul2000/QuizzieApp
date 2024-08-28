// src/components/common/CreateQuizModal.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/constant';
import './CreateQuiz.css'
import plus from '../../assets/plus.svg'; // Assuming your SVG is in the 'assets' folder
import bin from '../../assets/bin.svg'; 
import cross from '../../assets/cross.svg'; 
import CopyLink from './CopyLink';

const CreateQuiz = ({ onClose }) => {

//TODO fix this outside click to close the modal
  // const modalRef = useRef(null); // Create a ref to the modal container

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       onClose(); // Close the modal if clicked outside
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);   

  //   };
  // }, [onClose]);



   const [quizType,setQuizType]=useState(false)
  const [quizIndex,setQuizIndex]=useState(0)
  const [optionType,setOptionType]=useState("text")
  const [completed,setCompleted]=useState(false)
  const [linkId,setLinkId]=useState(false)

  const handleQuestionTextChange = (questionIndex, newQuestionText) => {
    setQuizData(prevQuizData => {
      const updatedQuestions = [...prevQuizData.questions];
      updatedQuestions[questionIndex].questionText = newQuestionText;
      return { ...prevQuizData, questions: updatedQuestions };
    });
  };

  const [quizData, setQuizData] = useState({
    title: '',
    type: 'qna', 
    questions: [
      { questionText: '', options: [{ text: '', imageUrl: '' }, { text: '', imageUrl: '' }], correctAnswer: 0, timer: null,type:'text' },
    ],
  });
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
    setQuizType(false)
    setQuizData({
      title: '',
      type: 'qna', 
      questions: [
        { questionText: '', options: [{ text: '', imageUrl: '' }, { text: '', imageUrl: '' }], correctAnswer: 0, timer: null,type:"text" },
      ],
    })
    onClose();


  }
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
      setQuizIndex(quizData.questions.length)
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
  } ) ; }
  });
   
    
    
    console.log("Error2",hasEmptyOptions,condion1)
    if (hasEmptyOptions || condion1) {
      toast.error('Please fill in all option fields.');
      isValid = false;
    }
    console.log("Error6",hasEmptyOptions)

    if (isValid) {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/quiz/create`, quizData, {
        headers: { Authorization: localStorage.getItem('token') },
      });

      console.log(quizData);
      toast.success('Quiz created successfully!');
      
      // Access the _id from the response
      const newQuizId = response.data._id; 
      setLinkId(newQuizId); 
      setCompleted(!completed)
        toast.success('Quiz created successfully!');
        
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to create quiz');
      }
    }
  };

  return (
    <div className="modal">
      <div className="content">
        {/* <span className="close" onClick={handleClose}>&times;</span> */}
        {/* <h2>Create New Quiz</h2> */}
        {!completed && <form onSubmit={handleSubmit}>
        {!quizType && (
        <>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <input
              type="text"
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleInputChange}
              placeholder='Quiz name'
              required
              className='quizName'
            />
          </div>
          <div>
          <div className='typeButton' >
                <label htmlFor="type" className='typeText'>Type:</label>
                <button
                  type="button" 
                  name="type" 
                  className={`type-button ${quizData.type === 'qna' ? 'active' : ''}`} 
                  onClick={() => setQuizData({ ...quizData, type: 'qna' })}
                >
                  Q&A
                </button>
                <button 
                  type="button" 
                  name="type" 
                  className={`type-button ${quizData.type === 'poll' ? 'active' : ''}`} 
                  onClick={() => setQuizData({ ...quizData, type: 'poll' })}
                >
                  Poll Type
                </button>
           
            </div>
          </div>
          <div className='buttons'>
            <button onClick={handleClose} className='cancel'>Cancel</button>
            <button
              className='cancel'
              style={(!quizData.title || !quizData.type) ? { backgroundColor: '#ccc', color: '#666', cursor: 'not-allowed' } : { backgroundColor:'#60B84B', color:'white' }}
              onClick={() => {
                setQuizType(!quizType)
              }}
              disabled={!quizData.title || !quizData.type}
            >
              Continue
            </button>
            </div>
          </>
          )}


          {!!quizType && (
          <div className='quizList'> 

            { /*  number section */}
            <div className='indexGrp' style={{display:'flex',justifyContent:'flex-start',alignItems:'center',margin:'10px 30px',padding:'0px 10px'}}>
              <div style={{display:'flex',flex:1,flexDirection:'row',alignItems:'center'}}>
             {quizData.questions.map((question, index) =><div className='quizIndex'  key={index} >
              <span style={{cursor:'pointer',padding:10}} 
              onClick={()=>{
                setQuizIndex(index)
                setOptionType(quizData.questions[index].type)
                }}>
                {index+1}</span>
             {index>0 && <img src={cross} className="close"  alt="remove" onClick={()=>handleRemoveQuestion(index)}  />}
             </div> )}
             <div style={{cursor:'pointer',}} className='plus' onClick={handleAddQuestion}><img src={plus} alt="Add" /></div>
             </div>
             <div style={{textAlign:'right'}}>Max of 5questions</div>

             </div >
              {/* QNA/Poll Question */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <input
              type="text"
              id="title"
              name="title"
              value={quizData.questions[quizIndex].questionText}
              onChange={(e) => handleQuestionTextChange(quizIndex, e.target.value)}
              placeholder={`${quizData.type} Question`  }
              required
              className='quizName'
              style={{height:'2.5rem'}}
            />
            </div>

              {/* detail section */}
             <div className='quizDetails'>
              
              {/* Option Type */}

              <div className='typeButton1' style={{
                
               
            }}>
                <label htmlFor="type" style={{whiteSpace:'nowrap'}}>Option Type</label>

                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="radio" 
                        name="type" 
                        value="text" 
                        checked={optionType === 'text'}
                        onChange={(e) => handleOptionType(e, quizIndex)} 
                    />
                    <div className="radio-button" style={{ marginLeft: '5px' }}>Text</div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="radio" 
                        name="type" 
                        value="imageUrl" 
                        checked={optionType === 'imageUrl'}
                        onChange={(e) => handleOptionType(e, quizIndex)} 
                    />
                    <div className="radio-button" style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>Image URL</div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="radio" 
                        name="type" 
                        value="both" 
                        checked={optionType === 'both'}
                        onChange={(e) => handleOptionType(e, quizIndex)} 
                    />
                    <div className="radio-button" style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>Text & Image URL</div>
                </label>
            </div>

             </div>
            {/* Conditional input rendering */}
            {/* Text */}
            
            {quizData.type === 'qna' && <div className='typeFields'  >
                <div className='optionGroup'>
                {optionType=="text"  &&(<div className='options'>
                  {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                    <div className='option' key={optionIndex}> 
                      <label key={optionIndex}>
                      <input 
                        type="radio" 
                        name={`question-${quizIndex}-options`} 
                        value={optionIndex}
                        checked={quizData.questions[quizIndex].correctAnswer === optionIndex} 
                        onChange={() => handleCorrectAnswerChange(quizIndex, optionIndex)} 
                        />
                      <span className="radio-button">
                        <input // Add an input field for editing
                          type="text"
                          value={opt.text}
                          placeholder="Text"
                        onClick={() => handleCorrectAnswerChange(quizIndex, optionIndex)} // Manually trigger the radio button selection
                          onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"text")}
                        />
                      </span> 
                      {optionIndex>1 && <img style={{marginLeft:10,cursor:'pointer'}}src={bin} alt="delete" onClick={() => handleRemoveOption(quizIndex, optionIndex)} />}
                    </label>
                    </div>
                  ))}
                  {currentOptionsLength < 4 && ( // Use currentOptionsLength in the condition
                  <div className='addOption'>
                      <button onClick={handleAddOption} className='addOption' id="addOption" type='button'>
                        Add Option
                      </button>
                      </div>
                    )}
                </div>)}
                {optionType === "imageUrl" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        <div className='option' key={optionIndex}>
                          <label key={optionIndex}>
                            <input
                              type="radio"
                              name={`question-${quizIndex}-options`}
                              value={optionIndex}
                              checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                              onChange={() => handleCorrectAnswerChange(quizIndex, optionIndex)}
                            />
                            <span className="radio-button">
                              <input // Input field for image URLs
                                type="url" // Change to 'url' for URL validation
                                value={opt.imageUrl}
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"imageUrl")}
                                placeholder="Enter image URL"
                                onClick={() => handleCorrectAnswerChange(quizIndex, optionIndex)} // Manually trigger the radio button selection

                              />
                            </span>
                            {optionIndex > 1 && (
                              <img
                                style={{ marginLeft: 10, cursor: 'pointer' }}
                                src={bin}
                                alt="delete"
                                onClick={() => handleRemoveOption(quizIndex, optionIndex)}
                              />
                            )}
                          </label>
                        </div>
                      ))}
                      {currentOptionsLength < 4 && (
                        <div className='addOption'>
                        <button onClick={handleAddOption} className='addOption' id="addOption">
                          Add Option
                        </button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* TODO fix both selected input as green color */}
                  {optionType === "both" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        <div className='option' key={optionIndex}>
                          <label key={optionIndex}>
                            <input
                              type="radio"
                              name={`question-${quizIndex}-options`}
                              value={optionIndex}
                              checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                              onChange={() => handleCorrectAnswerChange(quizIndex, optionIndex)}
                            />
                            <span className="radio-button">
                              <input // Add an input field for editing
                                type="text"
                                value={opt.text}
                                checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                                onClick={() => handleCorrectAnswerChange(quizIndex, optionIndex)} // Manually trigger the radio button selection
                                placeholder="Text"
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"text")}
                              />
                            </span> 
                            <span className="radio-button">
                              <input // Input field for image URLs
                                type="url" // Change to 'url' for URL validation
                                value={opt.imageUrl}
                                checked={quizData.questions[quizIndex].correctAnswer === optionIndex}
                                style={{ 
                                  backgroundColor: quizData.questions[quizIndex].correctAnswer == optionIndex ? '#60B84B' : 'white', 
                                  color: quizData.questions[quizIndex].correctAnswer === optionIndex ? '#FFFFFF' : '#474444',
                                  // ... other styles (outline, word-wrap, etc.)
                                }} 
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"imageUrl")}
                                placeholder="Enter image URL"
                              />
                            </span>
                            {optionIndex > 1 && (
                              <img
                                style={{ marginLeft: 10, cursor: 'pointer' }}
                                src={bin}
                                alt="delete"
                                onClick={() => handleRemoveOption(quizIndex, optionIndex)}
                              />
                            )}
                          </label>
                        </div>
                      ))}
                      {currentOptionsLength < 4 && (
                        
                        <div className='addOption'>
                      <button onClick={handleAddOption} className='addOption' id="addOption">
                        Add Option
                      </button>
                      </div>
                        
                      )}
                    </div>
                  )}
                  {quizData.type === 'qna' && <div className='timers'>
                    <span>Timer</span>
                    <button style={{height:5}} className={quizData.questions[quizIndex].timer==null?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, null)}
                    >OFF</button>
                    <button className={quizData.questions[quizIndex].timer==5?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, 5)}
                    >5sec</button>
                    <button className={quizData.questions[quizIndex].timer==10?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, 10)}
                    >10sec</button>
                  </div>}
                </div>
              </div>}
              {quizData.type === 'poll' && <div className='typeFields'  >
                <div className='optionGroup'>
                {optionType=="text"  &&(<div className='options'>
                  {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                    <div className='option' key={optionIndex}> 
                      <label key={optionIndex}>
                      
                      <span className="radio-button">
                        <input // Add an input field for editing
                          type="text"
                          placeholder='Text'
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"text")}
                        />
                      </span> 
                      {optionIndex>1 && <img style={{marginLeft:10,cursor:'pointer'}}src={bin} alt="delete" onClick={() => handleRemoveOption(quizIndex, optionIndex)} />}
                    </label>
                    </div>
                  ))}
                  {currentOptionsLength < 4 && ( // Use currentOptionsLength in the condition
                  <div className='addOption'>
                      <button onClick={handleAddOption} className='addOption' id="addOption">
                        Add Option
                      </button>
                      </div>
                    )}
                </div>)}
                {optionType === "imageUrl" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        <div className='option' key={optionIndex}>
                          <label key={optionIndex}>
                            
                            <span className="radio-button">
                              <input // Input field for image URLs
                                type="url" // Change to 'url' for URL validation
                                value={opt.imageUrl}
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"imageUrl")}
                                placeholder="Enter image URL"
                              />
                            </span>
                            {optionIndex > 1 && (
                              <img
                                style={{ marginLeft: 10, cursor: 'pointer' }}
                                src={bin}
                                alt="delete"
                                onClick={() => handleRemoveOption(quizIndex, optionIndex)}
                              />
                            )}
                          </label>
                        </div>
                      ))}
                      {currentOptionsLength < 4 && (
                        <div className='addOption'>
                        <button onClick={handleAddOption} className='addOption' id="addOption">
                          Add Option
                        </button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* TODO fix both selected input as green color */}
                  {optionType === "both" && (
                    <div className='options'>
                      {quizData.questions[quizIndex].options.map((opt, optionIndex) => (
                        <div className='option' key={optionIndex}>
                          <label key={optionIndex}>
                            
                            <span className="radio-button">
                              <input // Add an input field for editing
                                type="text"
                                value={opt.text}
                                placeholder='Text'
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"text")}
                              />
                            </span> 
                            <span className="radio-button">
                              <input // Input field for image URLs
                                type="url" // Change to 'url' for URL validation
                                value={opt.imageUrl}
                                onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"imageUrl")}
                                placeholder="Enter image URL"
                              />
                            </span>
                            {optionIndex > 1 && (
                              <img
                                style={{ marginLeft: 10, cursor: 'pointer' }}
                                src={bin}
                                alt="delete"
                                onClick={() => handleRemoveOption(quizIndex, optionIndex)}
                              />
                            )}
                          </label>
                        </div>
                      ))}
                      {currentOptionsLength < 4 && (
                        
                        <div className='addOption'>
                      <button onClick={handleAddOption} className='addOption' id="addOption">
                        Add Option
                      </button>
                      </div>
                        
                      )}
                    </div>
                  )}
                  {quizData.type === 'qna' && <div className='timers'>
                    <span>Timer</span>
                    <button style={{height:5}} className={quizData.questions[quizIndex].timer==null?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, null)}
                    >OFF</button>
                    <button className={quizData.questions[quizIndex].timer==5?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, 5)}
                    >5sec</button>
                    <button className={quizData.questions[quizIndex].timer==10?'timer-active':''}
                    onClick={(e) => handleTimerChange(e,quizIndex, 10)}
                    >10sec</button>
                  </div>}
                </div>
              </div>}

            {/* Image */}


            {/* {optionType=="Image URL"  &&
            <div className='typeFields' >Image URL</div>} */}






            {/* Text+URL */}
            {/* {optionType=="Text & Image URL"  &&<div className='typeFields' >Text & Image URL</div>} */}

             <div className='buttons'><button onClick={handleClose} className='cancel'>Cancel</button>
          <button className='createQuiz' type="submit">Create Quiz</button></div>
          </div>)}
        </form>}
        {completed && <CopyLink id={linkId} onClose={handleClose}/>}
      </div>
    </div>
  );
};

export default CreateQuiz;