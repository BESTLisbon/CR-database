import React, { useState, FormEvent } from 'react';
import { axiosInstance } from '../config/axiosInstance';

const Invite: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const invite = async (email: string): Promise<void> => {
    try {
      const response = await axiosInstance.post('/auth/invite', {
        email,
      });

      if (response.status === 200) {
        setSuccess(true);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await invite(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      {success ? <div>Success!</div> : <></>}
      <div>
        <label>Email:</label>
        <input
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type='submit'>Invite</button>
    </form>
  );
};

export default Invite;
