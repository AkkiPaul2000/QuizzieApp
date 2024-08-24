import React from 'react'
import './DelConfirm.css'
import cross from '../../../assets/cross.svg'

function DelConfirm({onClose,onSave}) {
  return (
    <div className='confirm'>
        <div className="message">
        <div className='text'>Are you confirm you want to delete ?</div>
        <div className="buttongrp">
        <button onClick={()=>onSave("Hey yaa")} className='delete' style={{backgroundColor:'#FF4B4B',color:'white'}}>Confirm Delete</button>
        <button onClick={onClose} className='cancel'>Cancel</button>
        </div>
        </div>
    </div>
  )
}

export default DelConfirm