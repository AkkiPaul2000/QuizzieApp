import React from 'react';
import { useLocation } from 'react-router-dom';
import './QuestionAnalysis.css'

const QuestionAnalysis = () => {
  const location = useLocation();
  const { quiz } = location.state || {}; // Access quiz data from the state
console.log(quiz)
  if (!quiz) {
    return <div>No quiz data available</div>;
  }
  const createdAtDate = new Date(quiz.createdAt);
        const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short', // Use 'short' for abbreviated month name
          year: 'numeric'
        });

  return (
    <div className="question-analysis">
      <div className="headerDiv">
        <h1>{quiz.title}- Question Analysis</h1>
        <div className='QuickData'><span>Created on: {formattedDate}</span><span>Impressions: {quiz.impressions}</span></div>
      </div>
      {quiz.type=="qna" && <div class="questions">
        {quiz.questions.map(question=>
        <div class="question-card">
        <h2>{question.questionText}</h2>
        <div style={{display:'flex',flexDirection:'row'}}>
        <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:'white',border:'10px'}}>
                <p className='impData'>{question.impressions}</p>
                <p>people Attempted the question</p>
        </div>
        <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <p className='impData'>{question.correctAttempts}</p>
                <p>people Answered Correctly</p>
        </div>
        <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <p className='impData'>{question.wrongAttempts}</p>
                <p>people Answered Incorrectly</p>
        </div>
        </div>
        </div>)}
        </div>}
        {quiz.type=="poll" && <div class="questions">
        {quiz.questions.map(question=>
        <div class="question-card">
        <h2>{question.questionText}</h2>
        <div style={{display:'flex',flexDirection:'row'}}>
          {question.options.map(option=>
        <div style={{display:'flex',flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white',border:'10px'}}>
                <p className='clickData'>{option.clicked}</p>
                <p>{option.text}</p>
        </div>)}
        </div>
        </div>)}
        </div>}
    </div>
  );
};

export default QuestionAnalysis;
