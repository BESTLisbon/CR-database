INSERT INTO company (name, abbreviation, website)
VALUES 
    ('Tech Corp', 'TC', 'https://www.techcorp.com'),
    ('ABC Inc', 'ABC', 'https://www.abcinc.com'),
    ('XYZ Ltd', 'XYZ', 'https://www.xyzltd.com');

INSERT INTO morada (address, company_id)
VALUES 
    ('123 Tech Lane, Tech City, Tech State, 12345', 1),
    ('456 Main Street, ABC Town, ABC State, 67890', 2),
    ('789 Elm Street, XYZ Village, XYZ State, 54321', 3);

INSERT INTO contact (type, contact, company_id)
VALUES 
    ('email', 'contact@techcorp.com', 1),
    ('phone', '555-1234', 1),
    ('email', 'info@abcinc.com', 2),
    ('phone', '555-5678', 2),
    ('email', 'support@xyzltd.com', 3),
    ('phone', '555-9876', 3);
