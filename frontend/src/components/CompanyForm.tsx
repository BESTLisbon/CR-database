import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const AddCompanyForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [abbreviation, setAbbreviation] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        setState: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setState(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('/companies', {
                name,
                abbreviation,
                website,
            });
            setMessage(response.data.message);
            setError('');
            // Optionally, clear the form
            setName('');
            setAbbreviation('');
            setWebsite('');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error);
            } else {
                setError('Error submitting form');
            }
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Add New Company</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Company Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => handleInputChange(e, setName)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="abbreviation">Abbreviation:</label>
                    <input
                        type="text"
                        id="abbreviation"
                        value={abbreviation}
                        onChange={(e) => handleInputChange(e, setAbbreviation)}
                    />
                </div>
                <div>
                    <label htmlFor="website">Website:</label>
                    <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => handleInputChange(e, setWebsite)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddCompanyForm;
