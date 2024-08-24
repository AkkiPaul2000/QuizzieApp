import React, { useState } from 'react'
import './CopyLink.css'
import { FRONTEND_URL } from '../../utils/constant'
import cross from '../../assets/cross.svg'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CopyLink({ id,onClose }) {
    const Link=`${FRONTEND_URL}${id}`;
    const handleCopyClick = () => {
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
  return (
    <div className='result'>
         <div className="close" ><img src={cross} alt="remove" onClick={onClose}  /></div>
        <div className='linkHeading'>Congrats your Quiz is Published!</div>
        <div className='linkDiv'>{Link}</div>
        <button onClick={handleCopyClick} className='share'>Share</button>
    </div>
  )
}

export default CopyLink