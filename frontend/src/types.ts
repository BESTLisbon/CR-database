export interface Contact {
    type: string;
    value: string;
}

export interface Company {
name: string;
addresses: string[];
contacts: Contact[];
}