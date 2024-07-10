import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotal } from '../../utils/invoices';

const defaultState = [


    {
        id: uuidv4(),
        description: '',
        unit_amount: 0,
        quantity: 0
    }
    // More projects...
];

const Label = ({ children }) => (
    <label className="sm:hidden block   text-[13px] font-medium leading-6 text-gray-900">{children}</label>
);

const InvoiceLineItemsTable = ({
    lineItems,
    setLineItems
}) => {

    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        setLineItems(
            lineItems.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        [name]: value
                    };
                }
                return item;
            })
        );
    };

    const addNewProject = () => {
        setLineItems(
            lineItems.concat({
                id: uuidv4(),
                description: '',
                unit_amount: 0,
                quantity: 0
            })
        );
    };


    let total = calculateTotal(lineItems);

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
                                <th scope="col" className="py-3.5  pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Project
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                    Unit amount
                                </th>
                                <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                    Quantity
                                </th>
                                <th scope="col" className="py-3.5 pl-3   text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((item) => (
                                <tr key={item.id} className="border-b last:border-0 border-gray-200">
                                    <td className="max-w-0 py-5   pr-3 text-sm sm:pl-0">
                                        <Label>Description</Label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            className="block max-sm:mt-1 w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                            placeholder="Project Description"
                                        />
                                        <div className="sm:hidden mt-1 space-y-1">
                                            <div className='my-3 space-y-1'>
                                                <Label>Unit amount</Label>

                                                <input
                                                    type="text"
                                                    name="unit_amount"
                                                    value={item.unit_amount}
                                                    onChange={(e) => handleInputChange(item.id, e)}
                                                    className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                                    placeholder="Unit amount"
                                                />
                                            </div>

                                            <Label>Quantity</Label>

                                            <input
                                                type="text"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleInputChange(item.id, e)}
                                                className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6 text-xs"
                                                placeholder="Quantity"
                                            />

                                        </div>
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                                        <input
                                            type="text"
                                            name="unit_amount"
                                            value={item.unit_amount}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 text-xs"
                                            placeholder="Unit amount"
                                        />
                                    </td>
                                    <td className="hidden px-3 py-5 text-right text-xs text-gray-500 sm:table-cell">
                                        <input
                                            type="text"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 text-xs"
                                            placeholder="Quantity"
                                        />
                                    </td>
                                    <td className="py-5 pl-3 pr-4 text-right text-xs text-gray-500 sm:pr-0">
                                        <p>{calculateTotal([item]) + '$'}</p>
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
                                <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">${total}</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="hidden  pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                                    Tax
                                </th>
                                <th scope="row" className=" pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                                    Tax
                                </th>
                                <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">$0</td>
                            </tr>
                            <tr>
                                <th scope="row" colSpan={3} className="hidden  pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                                    Total
                                </th>
                                <th scope="row" className=" pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                                    Total
                                </th>
                                <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">${total}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </>
    );
}

export default InvoiceLineItemsTable