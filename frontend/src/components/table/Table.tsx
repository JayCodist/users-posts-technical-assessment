import { Fragment, useState, useEffect, useMemo, ReactNode } from "react";
import { getPrefilledPaginationControls } from "./Table.utils";

export interface Column<T = unknown> {
  title: string;
  dataIndex: keyof T;
  key?: keyof T;
  sortBy?: string;
  render?: (cellData: unknown, row: T, index: number) => string | ReactNode;
  width?: string | number;
  absorbEvents?: boolean;
}

export interface Pagination {
  pageSize: number;
  total: number;
  pageNumber: number;
}

interface TableProps<T = unknown> {
  dataSource: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  onPageChange?: (pageNumber: number) => void;
  loading?: boolean;
  showCheckbox?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  emptyText?: string;
  paginateOnBrowser?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
  rowKeyField?: string;
}

const Table = <T = unknown,>(props: TableProps<T>): ReactNode => {
  const [pageCount, setPageCount] = useState(0);

  const {
    dataSource: _dataSource,
    columns: _columns,
    pagination,
    onPageChange = () => {},
    loading,
    emptyText,
    paginateOnBrowser,
    className,
    onRowClick,
  } = props;

  const columns: Column[] = [..._columns].filter(Boolean) as Column[];

  const dataSource: T[] = useMemo(() => {
    const pageSize = pagination?.pageSize || Infinity;
    const pageNumber = pagination?.pageNumber || 1;
    return paginateOnBrowser
      ? _dataSource.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize)
      : _dataSource.slice(0, pageSize);
  }, [paginateOnBrowser, pagination?.pageNumber, pagination?.pageSize, _dataSource]);

  const { pageSize = Infinity, total = dataSource.length, pageNumber = 1 } = pagination || {};

  const handlePageControlClick: (pageNumber: number) => void = (_page) => {
    if (_page >= 1 && _page <= pageCount) onPageChange(_page);
  };

  useEffect(() => {
    setPageCount(Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const getCellRender: (row: T, col: Column<T>, index: number) => ReactNode = (row, col, i) => {
    return col.render ? col.render(row[col.dataIndex], row, i) : String(row[col.dataIndex]);
  };

  const paginationControls = useMemo(() => {
    return getPrefilledPaginationControls(pageNumber, pageCount);
  }, [pageCount, pageNumber]);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 relative">
        <table className={`w-full border-collapse ${className || ""}`}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!dataSource.length && (
              <tr>
                <td colSpan={columns.length}>
                  <em className="block py-6 text-red-600 w-full text-center">{emptyText || "No data"}</em>
                </td>
              </tr>
            )}
            {dataSource.map((row, i) => (
              <Fragment key={i}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, j) => (
                    <td key={j} style={{ width: col.width }} className="px-6 py-4 text-sm text-gray-900">
                      {getCellRender(row, col, i)}
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>

        {loading && (
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-white bg-opacity-80 flex justify-center items-center">
          <div className="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
      </div>

      {pagination && (
        <div className={`flex items-center justify-end px-6 py-4 ${loading ? "pointer-events-none" : ""}`}>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageControlClick(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="px-3 py-2 text-sm text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              ← Previous
            </button>
            {paginationControls.map((control, index) =>
              control.pageNumber ? (
                <button
                  key={index}
                  onClick={() => handlePageControlClick(control.pageNumber || 1)}
                  className={`px-4 py-2 text-sm rounded-md ${
                    pageNumber === control.pageNumber
                      ? "bg-[#eee3fd] text-[#7343db]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {control.pageNumber}
                </button>
              ) : (
                <span key={index} className="px-2 text-sm text-gray-500">
                  ...
                </span>
              )
            )}
            <button
              onClick={() => handlePageControlClick(pageNumber + 1)}
              disabled={!pageCount || pageNumber === pageCount}
              className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
