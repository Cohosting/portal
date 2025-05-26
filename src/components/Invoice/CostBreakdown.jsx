import React from 'react';
import { calculateTotal } from '../../utils/invoices';

const BreakdownItem = ({ item }) => {
  return (
    <tr key={item.id} className="border-b border-gray-100">
      <td className="max-w-0 px-6 py-5 align-top">
        <div className="truncate text-gray-500">{item.description}</div>
      </td>
      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
        ${item.unit_amount}
      </td>
      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
        {item.quantity}
      </td>
      <td className="py-5 pl-8 pr-6 text-right align-top tabular-nums text-gray-700">
        ${calculateTotal([item])}
      </td>
    </tr>
  );
};
const CostBreakdown = ({ invoice }) => {
  return (
    <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
      <colgroup>
        <col className="w-full" />
        <col />
        <col />
        <col />
      </colgroup>
      <thead className="border-b border-gray-200 text-gray-900">
        <tr>
          <th scope="col" className="px-6 py-3 font-semibold">
            Projects
          </th>
          <th
            scope="col"
            className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
          >
            Unit amount
          </th>
          <th
            scope="col"
            className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
          >
            Quantity
          </th>
          <th scope="col" className="py-3 pl-8 pr-6 text-right font-semibold">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {invoice?.line_items.map(item => (
          <BreakdownItem item={item} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th
            scope="row"
            className="px-6 pb-0 pt-6 font-normal text-gray-700 sm:hidden"
          >
            Subtotal
          </th>
          <th
            scope="row"
            colSpan={3}
            className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
          >
            Subtotal
          </th>
          <td className="pb-0 pl-8 pr-6 pt-6 text-right tabular-nums text-gray-900">
            ${calculateTotal(invoice?.line_items)}
          </td>
        </tr>
        <tr>
          <th scope="row" className="pt-4 px-6 font-normal text-gray-700 sm:hidden">
            Tax
          </th>
          <th
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
          >
            Tax
          </th>
          <td className="pb-0 pl-8 pr-6 pt-4 text-right tabular-nums text-gray-900">
            $0.00
          </td>
        </tr>
        <tr>
          <th
            scope="row"
            className="pt-4 px-6 font-semibold text-gray-900 sm:hidden"
          >
            Total
          </th>
          <th
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
          >
            Total
          </th>
          <td className="pb-0 pl-8 pr-6 pt-4 text-right font-semibold tabular-nums text-gray-900">
            ${calculateTotal(invoice?.line_items)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default CostBreakdown;
