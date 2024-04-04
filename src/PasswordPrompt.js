import React, { useState } from 'react';

const PasswordPrompt = ({ onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password); // Pass the entered password to the onSubmit function
  };

  return (
    <div className="password-prompt">
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordPrompt;
