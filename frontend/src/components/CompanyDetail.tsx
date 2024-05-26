import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config/constants';
import { Company } from '../types';

interface CompanyDetailProps {
    companyName: string;
}

function CompanyDetail() {
  const { companyName } = useParams<CompanyDetailProps>();
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/company/${companyName}`)
      .then(response => {
        setCompanyDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching company details:', error);
      });
  }, [companyName]);

  return (
    <div>
      <h2>Company Detail</h2>
      {companyDetails ? (
        <div>
          <h3>{companyDetails.name}</h3>
          <h4>Addresses:</h4>
          <ul>
            {companyDetails.addresses.map((address, index) => (
              <li key={index}>{address}</li>
            ))}
          </ul>
          <h4>Contacts:</h4>
          <ul>
            {companyDetails.contacts.map((contact, index) => (
              <li key={index}>{contact.type}: {contact.value}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompanyDetail;
