import React, { useState } from 'react';
import { SimpleGrid, Box, Flex } from '@chakra-ui/react';

const Table = ({ columns, data, sortableColumns }) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleHeaderClick = column => {
    if (sortableColumns.includes(column)) {
      if (sortedColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortedColumn(column);
        setSortDirection('asc');
      }
    }
  };

  const getSortedData = () => {
    if (!sortedColumn || !sortDirection) {
      return data;
    }

    return data.slice().sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortedColumn] > b[sortedColumn] ? 1 : -1;
      } else {
        return a[sortedColumn] < b[sortedColumn] ? 1 : -1;
      }
    });
  };

  return (
    <SimpleGrid columns={columns.length} p="2">
      {/* Render table headers */}
      {columns.map((column, index) => (
        <Box
          borderBottom={'1px solid #eff1f4'}
          py={'5px'}
          key={index}
          p="2"
          cursor={sortableColumns.includes(column) ? 'pointer' : 'default'}
          onClick={() => handleHeaderClick(column)}
          fontSize={'13px'}
          lineHeight={'20px'}
          mb={'10px'}
        >
          {column}
        </Box>
      ))}
      {/* Render table rows */}
      {getSortedData().map((row, rowIndex) =>
        columns.map((column, colIndex) => (
          <Flex
            alignItems={'center'}
            borderBottom={'1px solid #f8fafb'}
            p={'7px'}
            fontSize={'13px'}
            key={`${rowIndex}-${colIndex}`}
            wordBreak="break-word"
            overflowWrap="break-word"
          >
            {typeof row[column] === 'object'
              ? // Render child component if the cell value is an object
                row[column]
              : // Render text value if the cell value is not an object
                row[column]}
          </Flex>
        ))
      )}
    </SimpleGrid>
  );
};

export default Table;
