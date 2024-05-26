import React from 'react';
import { useParams } from 'react-router-dom';

function CompanyDetail() {
    interface Params {
        companyName: string;
        }
        const params = useParams<Params>();
        const { companyName } = params;

    return (
        <div>
        <h2>Company Details for {companyName}</h2>
        </div>
    );
}

export default CompanyDetail;
