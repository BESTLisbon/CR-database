import re
import string
from typing import Dict, Tuple

from flask import current_app


class User:
    """
    Utility class for Users.
    Contains methods to validate parameters.
    Contains methods to constuct from various formats,
    Contains methods to serialize in various formats.
    """
    email: str
    name: str
    role: str

    @classmethod
    def user_from_register_form(cls, email: str, name: str) -> "User":
        """Build user from form data"""
        user = cls()
        user.email = email
        user.name = name
        user.role = "Member"
        return user

    @classmethod
    def user_from_query(cls, query: Tuple) -> "User":
        """Builds user from a SELECT * FROM users statement (only one row)"""
        user = cls()
        user.name = query[1]
        user.email = query[2]
        user.role = query[5]
        return user

    def to_dict(self) -> Dict[str, str]:
        return {
            "email": self.email,
            "name": self.name,
            "role": self.role,
        }

    @staticmethod
    def valid_name(name: str) -> bool:
        """Validates names (length and no special characters)"""
        return len(name) < 256 and "".join(name.split()).isalnum()

    @staticmethod
    def valid_email(email: str) -> bool:
        """Validates names (length and no special characters)"""
        email_pattern = re.compile(
            r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        )
        
        return email_pattern.match(email)

    @staticmethod
    def valid_password(password: str) -> bool:
        """Validates passwords
        In debug mode we don't validate so development is easier.
        In production -> min 8 characters, 1 digit, 1 special character, 1 uppercase
        """
        if current_app.debug:
            return True
        return (
            len(password) > 8
            and any(c in password for c in string.punctuation)
            and any(c in password for c in string.digits)
            and any(c in password for c in string.ascii_uppercase)
        )
