import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { ArrowDownCircleIcon, ArrowPathIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

const users = [
    { name: 'Jones Bonn', email: 'infode@gmail.com', avatar: 'path/to/jones.jpg' },
    { name: 'David Joe', email: 'TAJULDESIGNHQ@gmail.com', avatar: 'path/to/david.jpg' },
    { name: 'Osama Joe Anny', email: 'Osamaanny@gmail.com', avatar: 'path/to/osama.jpg' },
];

const invoices = [
    { name: 'Jones Bonn', invoiceNumber: '#0A9307', email: 'infode@gmail.com', date: '1/9/2023' },
    { name: 'David Joe', invoiceNumber: '#0A9307', email: 'joebusinessdavid@gmail.com', date: '17/7/2023' },
    { name: 'Jones Bonn', invoiceNumber: '#0A9307', email: 'infode@gmail.com', date: '25/8/2023' },
    { name: 'Osama Joe Anny', invoiceNumber: '#0A9307', email: 'Osamaanny@gmail.com', date: '2/9/2023' },
];
const days = [
    {
        date: 'Today',
        dateTime: '2023-03-22',
        transactions: [
            {
                id: 1,
                invoiceNumber: '00012',
                href: '#',
                amount: '$7,600.00 USD',
                tax: '$500.00',
                status: 'Paid',
                client: 'Reform',
                description: 'Website redesign',
                icon: ArrowUpCircleIcon,
            },
            {
                id: 2,
                invoiceNumber: '00011',
                href: '#',
                amount: '$10,000.00 USD',
                status: 'Withdraw',
                client: 'Tom Cook',
                description: 'Salary',
                icon: ArrowDownCircleIcon,
            },
            {
                id: 3,
                invoiceNumber: '00009',
                href: '#',
                amount: '$2,000.00 USD',
                tax: '$130.00',
                status: 'Overdue',
                client: 'Tuple',
                description: 'Logo design',
                icon: ArrowPathIcon,
            },
        ],
    },
    {
        date: 'Yesterday',
        dateTime: '2023-03-21',
        transactions: [
            {
                id: 4,
                invoiceNumber: '00010',
                href: '#',
                amount: '$14,000.00 USD',
                tax: '$900.00',
                status: 'Paid',
                client: 'SavvyCal',
                description: 'Website redesign',
                icon: ArrowUpCircleIcon,
            },
        ],
    },
]

const SearchableDropdown = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInvoices = invoices.filter(invoice =>
        invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        ''
    );
};

export default SearchableDropdown;