import React, { useState, FormEvent } from 'react';
import { BACKEND_URL } from '../config/constants';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { loginFromResponse } = useAuth();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${BACKEND_URL}auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('auth', JSON.stringify(response.data));
        loginFromResponse(response.data);
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
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;
