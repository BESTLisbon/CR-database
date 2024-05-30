import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config/constants'; 

function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/companies`)
      .then(response => {
        setCompanies(response.data.companies);
      })
      .catch(error => {
        console.error('Error fetching companies:', error);
      });
  }, []);

  return (
    <div>
      <h2>Company List</h2>
      {companies ? (
        <ul>
          {companies.map((company, index) => (
            <li key={index}>
              <Link to={`/companies/${company}`}>{company}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompanyList;
