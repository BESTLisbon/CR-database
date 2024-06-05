INSERT INTO
    company (name, abbreviation, website)
VALUES
    ('Tech Corp', 'TC', 'https://www.techcorp.com'),
    ('ABC Inc', 'ABC', 'https://www.abcinc.com'),
    ('XYZ Ltd', 'XYZ', 'https://www.xyzltd.com');

INSERT INTO
    morada (address, company_id)
VALUES
    ('123 Tech Lane, Tech City, Tech State, 12345', 1),
    ('456 Main Street, ABC Town, ABC State, 67890', 2),
    (
        '789 Elm Street, XYZ Village, XYZ State, 54321',
        3
    );

INSERT INTO
    contact (type, contact, company_id)
VALUES
    ('email', 'contact@techcorp.com', 1),
    ('phone', '555-1234', 1),
    ('email', 'info@abcinc.com', 2),
    ('phone', '555-5678', 2),
    ('email', 'support@xyzltd.com', 3),
    ('phone', '555-9876', 3);

INSERT INTO
    users (name, email, password, role, active)
VALUES
    (
        'admin',
        'admin@admin.com',
        -- pwd: "admin"
        'scrypt:32768:8:1$kAv5kLHRBo1QMTGg$98098abbd3d2864f85b7a56c9490bda6e7a73792c52a8a7520a6d23378344c13083472c8aa11c0cda7694480079b841c5f4f03ec8d34a256e67c3319be18152d',
        'Admin',
        TRUE
    )