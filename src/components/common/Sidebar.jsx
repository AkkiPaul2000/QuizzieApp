// src/components/common/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={{ width: '200px', backgroundColor: '#2c3e50', color: '#fff', padding: '20px' }}>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link></li>
          <li><Link to="/createQuiz" style={{ color: '#fff', textDecoration: 'none' }}>Create Quiz</Link></li>
          <li><Link to="/analytics" style={{ color: '#fff', textDecoration: 'none' }}>Quiz Analytics</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
