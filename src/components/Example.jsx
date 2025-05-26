import React, { useState } from 'react';

const initialProjects = [
    {
        id: 1,
        name: 'Logo redesign',
        description: 'New logo and digital asset playbook.',
        hours: '20.0',
        rate: '$100.00',
        price: '$2,000.00',
    },
    // More projects...
];

const Label = ({ children }) => (
    <label className="sm:hidden block   text-[13px] font-medium leading-6 text-gray-900">{children}</label>
);

export default function Example() {
    const [projects, setProjects] = useState(initialProjects);

    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, [name]: value } : project
            )
        );
    };

    const addNewProject = () => {
        setProjects((prev) => [
            ...prev,
            { id: prev.length + 1, name: '', description: '', hours: '', rate: '', price: '' },
        ]);
    };

    return (
        <>
            <div className="mt-5">
                <div className="  mt-0  ">
                    <table className="min-w-full">
                        <colgroup>
                            <col className="w-full sm:w-1/2" />
                            <col className="sm:w-1/6" />
                            <col className="sm:w-1/6" />
                            <col className="sm:w-1/6" />
                        </colgroup>
                        <thead className="border-b border-gray-300 text-gray-900">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Project
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                    Price
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                    Unit amount
                                </th>
                                <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b last:border-0 border-gray-200">
                                    <td className="max-w-0 py-5   pr-3 text-sm sm:pl-0">
                                        <Label>Description</Label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={project.description}
                                            onChange={(e) => handleInputChange(project.id, e)}
                                            className="block max-sm:mt-1 w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                            placeholder="Project Description"
                                        />
                                        <div className="sm:hidden mt-1 space-y-1">
                                            <div className='my-3 space-y-1'>
                                                <Label>Hours</Label>

                                                <input
                                                    type="text"
                                                    name="hours"
                                                    value={project.hours}
                                                    onChange={(e) => handleInputChange(project.id, e)}
                                                    className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                                    placeholder="Hours"
                                                />
                                            </div>

                                            <Label>Rate</Label>

                                            <input
                                                type="text"
                                                name="rate"
                                                value={project.rate}
                                                onChange={(e) => handleInputChange(project.id, e)}
                                                className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                                placeholder="Rate"
                                            />

                                        </div>
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                                        <input
                                            type="text"
                                            name="hours"
                                            value={project.hours}
                                            onChange={(e) => handleInputChange(project.id, e)}
                                            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 text-xs"
                                            placeholder="Hours"
                                        />
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-xs text-gray-500 sm:table-cell">
                                        <input
                                            type="text"
                                            name="rate"
                                            value={project.rate}
                                            onChange={(e) => handleInputChange(project.id, e)}
                                            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 text-xs"
                                            placeholder="Rate"
                                        />
                                    </td>
                                    <td className="py-5 pl-3 pr-4 text-right text-xs text-gray-500 sm:pr-0">
                                        <p>{project.price}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <button
                                        onClick={addNewProject}
                                        className="btn-indigo"
                                    >
                                        Add New Item
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="hidden  pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                                    Subtotal
                                </th>
                                <th scope="row" className=" pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                                    Subtotal
                                </th>
                                <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">$8,800.00</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="hidden  pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                                    Tax
                                </th>
                                <th scope="row" className=" pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                                    Tax
                                </th>
                                <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">$1,760.00</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="hidden  pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                                    Total
                                </th>
                                <th scope="row" className=" pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                                    Total
                                </th>
                                <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">$10,560.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                    Add your comment
                </label>
                <div className="mt-2">
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                    />
                </div>
            </div>
        </>
    );
}
