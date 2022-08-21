import React, { useMemo } from 'react';
import { Table } from 'reactstrap';
import { useTable } from 'react-table';
import { useSelector } from 'react-redux';
import EditableCell from '../helpers/EditableCell';

interface Data {}

const ReactTable = () => {
  const data = useSelector(
    (state: {
      synonyms: {
        [key: string]: any;
      };
    }) => state.synonyms.results.synonyms
  );
  const updatedData: Data[] = [...data].map((e) => {
    return {
      synonym: e,
    };
  });

  const data2 = useMemo(() => [...updatedData], [updatedData]);

  const defaultColumn: any = {
    Cell: EditableCell,
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Synonyms',
        id: 'synonym',
        accessor: 'synonym',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: data2,
      defaultColumn,
    });

  return (
    <div className="d-flex flex-column " style={{ marginBottom: '40px' }}>
      <Table bordered {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const { render, getHeaderProps } = column;
                return <th {...getHeaderProps()}>{render('Header')}</th>;
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReactTable;
