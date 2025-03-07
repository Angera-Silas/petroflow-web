/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTable, useSortBy, useFilters, usePagination, Column, TableInstance, TableState, Row, HeaderGroup } from 'react-table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { JSX } from 'react/jsx-runtime';

interface PivotTableProps {
  data: { [key: string]: any }[];
  columns: string[];
  rowKey: string;
  theme?: string;
}

interface ExtendedTableState<T extends object> extends TableState<T> {
  pageIndex: number;
  pageSize: number;
}

interface ExtendedHeaderGroup<T extends object> extends HeaderGroup<T> {
  getSortByToggleProps: () => any;
  isSorted: boolean;
  isSortedDesc: boolean;
}

const PivotTable: React.FC<PivotTableProps> = ({ data, columns, rowKey, theme = "light" }) => {
  const tableColumns: Column<{ [key: string]: any }>[] = React.useMemo(
    () => [
      {
        Header: rowKey,
        accessor: rowKey,
      },
      ...columns.map((col) => ({
        Header: col,
        accessor: col,
      })),
    ],
    [columns, rowKey]
  );

  const tableData = React.useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: { pageIndex: 0 } as Partial<ExtendedTableState<{ [key: string]: any }>>,
    },
    useFilters,
    useSortBy,
    usePagination
  ) as TableInstance<{ [key: string]: any }> & {
    page: Row<{ [key: string]: any }>[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageOptions: number[];
    pageCount: number;
    gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (pageSize: number) => void;
    state: ExtendedTableState<{ [key: string]: any }>;
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <table {...getTableProps()} className="w-full border-collapse border border-gray-300">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...(column as ExtendedHeaderGroup<{ [key: string]: any }>).getHeaderProps((column as ExtendedHeaderGroup<{ [key: string]: any }>).getSortByToggleProps())}
                  className="border p-2 cursor-pointer"
                >
                  {column.render('Header')}
                  <span>
                    {(column as ExtendedHeaderGroup<{ [key: string]: any }>).isSorted ? (
                      (column as ExtendedHeaderGroup<{ [key: string]: any }>).isSortedDesc ? (
                        <FaSortDown className="inline ml-2" />
                      ) : (
                        <FaSortUp className="inline ml-2" />
                      )
                    ) : (
                      <FaSort className="inline ml-2" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="border p-2">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div>
          <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PivotTable;