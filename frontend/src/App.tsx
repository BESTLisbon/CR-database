import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BACKEND_URL } from './config/constants'; // Import the URL from the constants file

function App() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}companies`)
      .then(response => {
        console.log('Response:', response.data);
        setCompanies(response.data.companies);
      })
      .catch(error => {
        console.error('Error fetching companies:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Company List</h1>
      </header>
      <main>
        <ul>
          {companies.map((company, index) => (
            <li key={index}>{company}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
