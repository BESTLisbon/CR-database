import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config/constants';
import { axiosInstance } from '../config/axiosInstance';

interface CompanyListResponse {
  companies: string[];
}

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    axiosInstance.get<CompanyListResponse>('/companies')
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
      {companies.length > 0 ? (
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
      <div>
        <Link to="/companies/new">Add New Company</Link>
      </div>
    </div>
  );
}

export default CompanyList;
