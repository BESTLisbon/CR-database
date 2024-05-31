import React, { useState, FormEvent } from 'react';
import { BACKEND_URL } from '../config/constants';
import axios from 'axios';


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${BACKEND_URL}login`, { email, password });
      
      if (response.status === 200) {
        localStorage.setItem('token', response.data.access_token);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
