import type { ReactNode } from "react";

type DataTableProps = {
  headers: string[];
  rows: Array<Array<ReactNode>>;
};

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="table-empty" colSpan={headers.length}>
                No records yet.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`row-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${index}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
