// src/components/common/CreateQuizModal.jsx

import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import axios from 'axios';

import { BACKEND_URL } from '../../utils/constant';

import './CreateQuiz.css'

import plus from '../../assets/plus.svg'; // Assuming your SVG is in the 'assets' folder

import bin from '../../assets/bin.svg'; 

import cross from '../../assets/cross.svg'; 



const CreateQuiz = ({ onClose }) => {



//TODO fix this outside click to close the modal

  // const modalRef = useRef(null); // Create a ref to the modal container



  // useEffect(() => {

  //   const handleClickOutside = (event) => {

  //     if (modalRef.current && !modalRef.current.contains(event.target)) {

  //       onClose(); // Close the modal if clicked outside

  //     }

  //   };



  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {

  //     document.removeEventListener('mousedown', handleClickOutside);   



  //   };

  // }, [onClose]);

  

   const [quizType,setQuizType]=useState(false)

  const [quizIndex,setQuizIndex]=useState(0)

  const [optionType,setOptionType]=useState("text")



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

    console.log(e.target.value)

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

      console.log(quizData)

  };  

  const handleAddOption = () => {

    console.log("Yo");

  

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

    console.log(quizData)

    console.log(index)

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

  

    let isValid = true; // Flag to track validation status

  

    // Check if correctAnswer is within the bounds of options

    quizData.questions.forEach((ques) => {

      if (ques.options.length - 1 < ques.correctAnswer) {

        toast.error('Check your answers - Correct answer index is out of bounds.');

        isValid = false; // Set the flag to false if there's an error

      }

    });

  

    // Other validation checks (title, questionText, empty options)

    if (!quizData.title || quizData.questions.some(q => !q.questionText)) {

      toast.error('Please fill in all required fields.');

      isValid = false;

    }

  

    var hasEmptyOptions = quizData.questions.some(question => 

      question.options.some(option => option.text.trim() === '' && option.imageUrl.trim() === '')

    );

    if (optionType === "both") {

      hasEmptyOptions = quizData.questions.some(question => 

        question.options.some(option => option.text.trim() === '' || option.imageUrl.trim() === '')

      );

    }

    if (optionType === "text") {

      hasEmptyOptions = quizData.questions.some(question => 

        question.options.some(option => option.text.trim() === '')

      );

    }

    if (optionType === "imageUrl") {

      hasEmptyOptions = quizData.questions.some(question => 

        question.options.some(option =>option.imageUrl.trim() === '')

      );

    }

    if (hasEmptyOptions) {

      toast.error('Please fill in all option fields.');

      isValid = false;

    }

   

    if (isValid) {

      try {

        await axios.post(`${BACKEND_URL}/api/quiz/create`, quizData, {

          headers: { Authorization: localStorage.getItem('token') },

        });

        console.log(quizData)

        toast.success('Quiz created successfully!');

        onClose(); 

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

        <form onSubmit={handleSubmit}>

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



            { /*  number section */}

            <div className='indexGrp' style={{display:'flex',justifyContent:'flex-start',alignItems:'center',margin:'10px 30px',padding:'0px 10px'}}>

             {quizData.questions.map((question, index) =><div className='quizIndex'  key={index} >

              <span style={{cursor:'pointer'}} 

              onClick={()=>{

                setQuizIndex(index)

                setOptionType(quizData.questions[index].type)

                }}>

                {index+1}</span>

             {index>0 && <img src={cross} className="close"  alt="remove" onClick={()=>handleRemoveQuestion(index)}  />}

             </div> )}

             <div style={{cursor:'pointer',}} className='plus' onClick={handleAddQuestion}><img src={plus} alt="Add" /></div>

             </div >

              {/* QNA/Poll Question */}

              <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>

              <input

              type="text"

              id="title"

              name="title"

              value={quizData.questions[quizIndex].questionText}

              onChange={(e) => handleQuestionTextChange(quizIndex, e.target.value)}

              placeholder={`${quizData.type} Question`  }

              required

              className='quizName'

              style={{height:'2.5rem'}}

            />

            </div>



              {/* detail section */}

             <div className='quizDetails'>

              

              {/* Option Type */}



              <div className='typeButton1' style={{

                margin: '10px 50px',

                display: 'flex',

                flexWrap: 'wrap',

                alignItems: 'center',

                

                gap: '10px',

               

            }}>

                <label htmlFor="type">Option Type</label>



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

            

            <div className='typeFields'  >

                <div className='optionGroup'>

                {optionType=="text"  &&(<div className='options'>

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

                          onChange={(e) => handleOptionTextChange(quizIndex, optionIndex, e.target.value,"text")}

                        />

                      </span> 

                      {optionIndex>1 && <img style={{marginLeft:10,cursor:'pointer'}}src={bin} alt="delete" onClick={() => handleRemoveOption(quizIndex, optionIndex)} />}

                    </label>

                    </div>

                  ))}

                  {currentOptionsLength < 4 && ( // Use currentOptionsLength in the condition

                      <button onClick={handleAddOption} >

                        Add Option

                      </button>

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

                        <button onClick={handleAddOption}>

                          Add Option

                        </button>

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

                        <button onClick={handleAddOption}>

                          Add Option

                        </button>

                      )}

                    </div>

                  )}

                  <div className='timers'>

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

                  </div>

                </div>

              </div>

           



            {/* Image */}





            {/* {optionType=="Image URL"  &&

            <div className='typeFields' >Image URL</div>} */}













            {/* Text+URL */}

            {/* {optionType=="Text & Image URL"  &&<div className='typeFields' >Text & Image URL</div>} */}



             <div className='buttons'><button onClick={handleClose} className='cancel'>Cancel</button>

          <button className='createQuiz' type="submit">Create Quiz</button></div>

          </div>)}

        </form>

      </div>

    </div>

  );

};



export default CreateQuiz;



keep my quizname as the same format 

I want the quizlist to be modified where the format will be 

questionIndexes in a same row

qna/pollQuestion Input in a same row

quizDetails in a same row 

Type field in a same row

and buttons in a same row



where inside Typefield I want my optionGroup in same line 

I want my options and timers divs in a same line 

where each option component radio buttons,input text both text and url of same size and by side



the  css is below

.modal {

    display: flex;

    /* Set modal container as flex */

    justify-content: center;

    /* Center horizontally */

    align-items: center;

    /* Center vertically */

    position: fixed;

    z-index: 1;

    left: 0;

    top: 0;

    width: 100%;

    height: 100%;

    overflow: auto;

    background-color: rgba(0, 0, 0, 0.4);

    /* Black w/ opacity */

    color: #9F9F9F;

    font-weight: 500;

}





/* Modal Content */



.content {

    display: flex;

    background-color: #fefefe;

    padding: 70px;

    border: 1px solid #888;

    width: 35%;

    /* Increased width to 80% */

    min-width: 500px;

    /* Adjusted max width */

    border-radius: 10px;

    justify-content: center;

    align-items: center;

}



.modal .content button:hover {

    box-shadow: 0px 0px 25px 0px #00000026;

}



.modal .content input[type="text"] {

    background-color: #FFFFFF;

    font-family: Poppins;

    font-size: 25px;

    font-weight: 500;

    line-height: 37.5px;

    text-align: left;

    color: #9F9F9F;

}



.modal .content input[type="text"]::placeholder {

    color: #9F9F9F;

    /* Placeholder text color */

    background-color: #FFFFFF;

    font-family: Poppins;

    font-size: 25px;

    font-weight: 500;

    line-height: 37.5px;

    text-align: left;

}



.close {

    color: #aaa;

    float: right;

    font-size: 28px;

    font-weight: bold;

}



.close:hover,

.close:focus {

    color: black;

    text-decoration: none;

    cursor: pointer;

}



.radio-button {

    display: flex;

    /* padding: 7px 50px; */

    /* border: 1px solid #ccc; */

    /* border-radius: 10px; */

    background-color: #FFFFFF;

    cursor: pointer;

    /* box-shadow: 0px 0px 25px 0px #00000026; */

    font-weight: 500;

    color: #9F9F9F;

}



.typeButton {

    display: flex;

    margin: 1rem 3rem;

    justify-content: center;

    align-items: center;

}



.typeButton label {

    flex: 1;

    justify-content: center;

    align-items: center;

    text-align: center;

    font-weight: 500;

    color: #9F9F9F;

}



.type-button {

    /* ... your default button styles ... */

    flex: 1;

    background-color: #FFFFFF;

    display: flex;

    /* padding: 7px 50px; */

    border: 1px solid #ccc;

    height: 50px;

    margin: 10px 40px;

    border-radius: 10px;

    background-color: #FFFFFF;

    cursor: pointer;

    box-shadow: 0px 0px 25px 0px #00000026;

    font-weight: 500;

    color: #9F9F9F;

    justify-content: center;

    align-items: center;

    font-family: Poppins;

    font-size: 20px;

    font-weight: 500;

    line-height: 30px;

    text-align: center;

}



.type-button.active {

    background-color: #60B84B;

    /* Or any color you prefer */

    color: #FFFFFF;

}



.typeText {

    font-family: Poppins;

    font-size: 25px;

    font-weight: 500;

    line-height: 37.5px;

    text-align: center;

}





/* /////////////////////////////////////////////// */





/* Media query for smaller screens */





/* ////////////////////////////// */





/* .typeButton1 label:nth-of-type(2) {

    display: flex;

    flex: 2;

    flex-direction: row;

}



.typeButton1 label div {

    display: flex;

    flex-direction: row;

    flex: 1;

    justify-content: center;

    align-items: center;

}



.typeButton1 label:first-child {

    display: flex;

    flex: 1;

} */





/* .typeButton1 div label:nth-of-type(2) {

    background-color: red;

} */



.typeButton1 {

    display: flex;

    flex: 1;

    color: white;

    justify-content: space-around;

    /* Distribute items evenly */

    align-items: center;

    width: 100%;

    /* Take up the full width */

    margin: 10px 50px;

    /* Adjust margin as needed */

    background-color: red;

    /* Remove red background */

}



.typeButton1 label {

    color: #9F9F9F;

    display: flex;

    align-items: center;

    /* Other label styles as needed */

}



.typeButton1 label:first-child {

    display: flex;

    flex: 1;

    /* background-color: rebeccapurple; */

}





/* Media query for smaller screens */



.quizName {

    border-radius: 10px;

    height: 4rem;

    flex: 0.9;

    margin: 10px 0px;

    border: #FFFFFF;

    box-shadow: 0px 0px 25px 0px #00000026;

    font-size: 16px;

    font-weight: 500;

    color: #9F9F9F;

    &::placeholder {

        color: #9F9F9F;

    }

    padding-left: 20px;

    &:focus {

        outline: none;

        border: none;

    }

}



.quizIndex {

    font-size: '20px';

    width: 20px;

    /* Adjust the size as needed */

    height: 20px;

    border-radius: 50%;

    /* Creates the circular shape */

    border: 2px solid #FFFFFF;

    display: flex;

    /* Use flexbox for easy centering */

    justify-content: center;

    align-items: center;

    margin: 0px 20px;

    padding: 10px;

    /* Add padding inside the circle */

    box-shadow: 0px 0px 10px 0px #00000026;

    color: #9F9F9F;

    position: relative;

}



.quizIndex .close {

    display: flex;

    align-items: center;

    justify-content: center;

    position: absolute;

    top: -2px;

    /* Adjust as needed for vertical positioning */

    right: 0px;

    /* Adjust as needed for horizontal positioning */

    font-weight: 300;

    font-size: 22px;

}



.quizIndex .close:hover,

.quizIndex .close:focus {

    color: #aaa;

    filter: invert(70%);

    /* Or any other filter you like */

    text-decoration: none;

    cursor: pointer;

}



.plus:hover,

.plus:focus {

    filter: invert(100%);

    /* Or any other filter you like */

    text-decoration: none;

    cursor: pointer;

}



input[type="button"]:disabled,

button:disabled {

    background-color: lightgray;

    color: gray;

    cursor: not-allowed;

}



.modal .content button {

    width: 171px;

    height: 46px;

    gap: 0px;

    border-radius: 10px;

    opacity: 0px;

    white-space: nowrap;

}



.buttons .cancel {

    background-color: #FFFFFF;

    box-shadow: 0px 0px 15px 0px #00000040;

    font-family: 'Poppins';

    font-size: 21px;

    font-weight: 600;

    line-height: 31.5px;

    text-align: left;

    color: var(--fontColor1);

    display: flex;

    align-items: center;

    justify-content: center;

}



.buttons {

    display: flex;

    height: 46.14px;

    margin: 25px 0px;

}



button {

    cursor: pointer;

}



.buttons button {

    font-weight: 600;

    font-size: 15px;

    flex: 1;

    margin: 5px 30px;

    border-radius: 10px;

    opacity: 0px;

    box-shadow: 0px 0px 15px 0px #00000040;

    border: #FFFFFF;

}



.createQuiz {

    background-color: #60B84B;

    box-shadow: 0px 0px 15px 0px #00000040;

    font-family: 'Poppins';

    font-size: 21px;

    font-weight: 600;

    line-height: 31.5px;

    text-align: left;

    color: var(--fontColor1);

    display: flex;

    align-items: center;

    justify-content: center;

}



.quizList {

    display: flex;

    flex-direction: column;

    /* background-color: red; */

}



.typeFields {

    display: flex;

    justify-content: center;

    align-items: center;

}



.typeFields .optionGroup {

    flex: 0.9;

    display: flex;

    background-color: red;

}



.typeFields .optionGroup .options {

    flex: 3;

    display: flex;

    flex-direction: column;

    justify-content: flex-start;

}



.typeFields .optionGroup .options .option {

    color: black;

    flex: 1;

    display: flex;

    flex-direction: row;

}



.typeFields .optionGroup .options .option label {

    display: flex;

    flex: 1;

    /* Use flexbox for layout */

    align-items: center;

    /* Vertically align items to the center */

}





/* .option input[type="radio"] {

    margin-right: 10px;

} */



.option input[type="radio"]:checked+.radio-button input[type="text"] {

    background: #60B84B;

    color: #FFFFFF;

}



.option input[type="radio"]:checked+.radio-button input[type="url"] {

    background: #60B84B;

    color: #FFFFFF;

}



.option input[type="text"] {

    flex: 1;

    display: flex;

    border: 1px solid #ccc;

    /* padding: 5px 50px;

    margin: 10px;

    height: 30px; */

    border-radius: 10px;

    cursor: pointer;

    box-shadow: 0px 0px 25px 0px #00000026;

    font-weight: 500;

    color: #9F9F9F;

    justify-content: center;

    align-items: center;

}



.option input[type="url"] {

    flex: 1;

    display: flex;

    padding: 5px 50px;

    border: 1px solid #ccc;

    margin: 10px;

    height: 30px;

    border-radius: 10px;

    cursor: pointer;

    box-shadow: 0px 0px 25px 0px #00000026;

    font-weight: 500;

    color: #9F9F9F;

    justify-content: center;

    align-items: center;

}





/* Allow the input to grow and take up available space */



.typeFields .optionGroup .timers {

    flex: 1;

    display: flex;

    align-items: center;

    justify-content: flex-end;

    flex-direction: column;

    margin-top: 3rem;

}



.typeFields .optionGroup .timers button {

    font-weight: 400;

    font-size: 11px;

    flex: 1;

    margin: 3px 0px;

    border-radius: 10px;

    box-shadow: 0px 0px 15px 0px #00000026;

    border: #FFFFFF;

    background-color: #FFFFFF;

    padding: 0px 30px;

    height: 25px;

    /* Adjust this value to your desired height */

    color: #9F9F9F;

}



.typeFields .optionGroup .timers span {

    color: #9F9F9F;

}



.typeFields .optionGroup .timers .timer-active {

    background-color: green;

    color: white;

}



modify the parts accordingly as asked on both createQuiz.jsx file and css