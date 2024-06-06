import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { axiosInstance } from '../config/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

interface LocationState {
  from: {
    pathname: string;
  };
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { loginFromResponse } = useAuth();
  let history = useHistory();
  let location = useLocation<LocationState>();
  let { from } = location.state || { from: { pathname: "/" } };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/register', formData);
      if (response.status !== 201) {
        throw new Error('Failed to register');
      }

      localStorage.setItem('auth', JSON.stringify(response.data));
      loginFromResponse(response.data);
      history.replace(from);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError; // Cast error to AxiosError
        if (axiosError.response?.data?.error) {
          setErrorMessage(axiosError.response.data.error);
        } else {
          setErrorMessage('An error occurred');
        }
      } else {
        setErrorMessage('An error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit'>Register</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default RegisterForm;
