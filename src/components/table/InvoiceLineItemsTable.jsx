import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotal } from '../../utils/invoices';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultState = [
    {
        id: uuidv4(),
        description: '',
        unit_amount: 0,
        quantity: 1
    }
];

// Custom label for mobile view
const MobileLabel = ({ children }) => (
    <Label className="sm:hidden block text-[13px] font-medium leading-6 text-gray-900">{children}</Label>
);

// Error message component with consistent height - always renders but invisible when no error
const ErrorMessage = ({ error, className = "" }) => {
    return (
        <p className={cn("text-xs mt-2 h-4", error ? "text-red-600" : "text-transparent", className)}>
            {error || "No error"}
        </p>
    );
};

const InvoiceLineItemsTable = ({
    lineItems = defaultState,
    setLineItems,
    errors = null
}) => {
    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        setLineItems(
            lineItems.map((item) => {
                if (item.id === id) {
                    let newValue = value;
                    if (name === 'quantity') {
                        newValue = Math.max(0, Math.round(value)); // Ensure integer and non-negative
                    } else if (name === 'unit_amount') {
                        newValue = Math.max(0, parseFloat(value) || 0); // Ensure non-negative
                    }
                    return {
                        ...item,
                        [name]: newValue
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
                quantity: 1
            })
        );
    };

    const removeProject = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter(item => item.id !== id));
        }
    };

    // Helper function to get error for a specific line item and field
    const getFieldError = (index, fieldName) => {
        if (!errors || typeof errors !== 'object' || !Array.isArray(errors)) return null;
        return errors[index]?.[fieldName] || null;
    };

    // Check if any line item has errors
    const hasLineItemErrors = errors && Array.isArray(errors) && errors.some(itemError => itemError && Object.keys(itemError).length > 0);

    let total = calculateTotal(lineItems);

    return (
        <div className="mt-5">
            {/* Show general line items error */}
            {typeof errors === 'string' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{errors}</p>
                </div>
            )}

            <div className="mt-0">
                <table className="min-w-full">
                    <colgroup>
                        <col className="w-full sm:w-1/2" />
                        <col className="sm:w-1/6" />
                        <col className="sm:w-1/6" />
                        <col className="sm:w-1/6" />
                        <col className="sm:w-12" />
                    </colgroup>
                    <thead className="border-b border-gray-300 text-gray-900">
                        <tr>
                            <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Project
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                Unit amount
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                                Quantity
                            </th>
                            <th scope="col" className="py-3.5 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                                Total
                            </th>
                            <th scope="col" className="py-3.5 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-0 w-12">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map((item, index) => {
                            const descriptionError = getFieldError(index, 'description');
                            const quantityError = getFieldError(index, 'quantity');
                            const unitAmountError = getFieldError(index, 'unit_amount');

                            return (
                                <tr key={item.id} className="border-b last:border-0 border-gray-200">
                                    <td className="max-w-0 py-5 pb-0 pr-3 text-sm sm:pl-0">
                                        <div className="sm:hidden font-semibold mb-2">#{index + 1}</div>
                                        <MobileLabel>Description</MobileLabel>
                                        <div className="space-y-2">
                                            <Input
                                                type="text"
                                                name="description"
                                                value={item.description}
                                                onChange={(e) => handleInputChange(item.id, e)}
                                                className={cn(
                                                    "max-sm:mt-1 w-full text-xs",
                                                    descriptionError && "border-red-500 focus:border-red-500"
                                                )}
                                                placeholder="Project Description"
                                            />
                                            <ErrorMessage error={descriptionError} />
                                        </div>
                                        
                                        <div className="sm:hidden mt-1 space-y-1">
                                            <div className='my-3 space-y-2'>
                                                <MobileLabel>Unit amount</MobileLabel>
                                                <Input
                                                    type="number"
                                                    name="unit_amount"
                                                    value={item.unit_amount}
                                                    onChange={(e) => handleInputChange(item.id, e)}
                                                    className={cn(
                                                        "w-full text-xs",
                                                        unitAmountError && "border-red-500 focus:border-red-500"
                                                    )}
                                                    placeholder="Unit amount"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <ErrorMessage error={unitAmountError} />
                                            </div>

                                            <div className="space-y-2">
                                                <MobileLabel>Quantity</MobileLabel>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange(item.id, e)}
                                                    className={cn(
                                                        "w-full text-xs",
                                                        quantityError && "border-red-500 focus:border-red-500"
                                                    )}
                                                    placeholder="Quantity"
                                                    min="0"
                                                    step="1"
                                                />
                                                <ErrorMessage error={quantityError} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden px-3 py-5 pb-0 text-right text-sm text-gray-500 sm:table-cell">
                                        <div className="space-y-2">
                                            <Input
                                                type="number"
                                                name="unit_amount"
                                                value={item.unit_amount}
                                                onChange={(e) => handleInputChange(item.id, e)}
                                                className={cn(
                                                    "w-full text-xs text-right",
                                                    unitAmountError && "border-red-500 focus:border-red-500"
                                                )}
                                                placeholder="Unit amount"
                                                min="0"
                                                step="0.01"
                                            />
                                            <ErrorMessage error={unitAmountError} />
                                        </div>
                                    </td>
                                    <td className="hidden px-3 py-5 pb-0 text-right text-xs text-gray-500 sm:table-cell">
                                        <div className="space-y-2">
                                            <Input
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleInputChange(item.id, e)}
                                                className={cn(
                                                    "w-full text-xs text-right",
                                                    quantityError && "border-red-500 focus:border-red-500"
                                                )}
                                                placeholder="Quantity"
                                                min="0"
                                                step="1"
                                            />
                                            <ErrorMessage error={quantityError} />
                                        </div>
                                    </td>
                                    <td className="py-5 pt-0 pb-0 pl-3 pr-4 text-right text-xs text-gray-500 sm:pr-0">
                                        <p>${calculateTotal([item])}</p>
                                    </td>
                                    <td className="py-5 pt-0 pb-0 pl-3 pr-4 text-right text-xs text-gray-500 sm:pr-0">
                                        {lineItems.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeProject(item.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>
                                <Button
                                    type="button"
                                    onClick={addNewProject}
                                    variant="outline"
                                    className="flex items-center gap-2 mt-4"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add New Item
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colSpan={4} className="hidden pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                                Subtotal
                            </th>
                            <th scope="row" className="pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                                Subtotal
                            </th>
                            <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">${total}</td>
                        </tr>
                        <tr>
                            <th scope="row" colSpan={4} className="hidden pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                                Tax
                            </th>
                            <th scope="row" className="pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                                Tax
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">$0</td>
                        </tr>
                        <tr>
                            <th scope="row" colSpan={4} className="hidden pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                                Total
                            </th>
                            <th scope="row" className="pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                                Total
                            </th>
                            <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">${total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default InvoiceLineItemsTable;