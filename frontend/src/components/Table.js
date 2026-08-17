import React from 'react';
import '../styles/Table.css';

function Table({ columns, data, actions, emptyMessage = 'No data available' }) {
  return (
    <div className="table-container">
      <table className="data-table">
        {/* Table Head */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {actions && <th style={{ width: '100px' }}>Actions</th>}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="table-row">
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="table-actions">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        className={`action-btn ${action.type || ''}`}
                        onClick={() => action.onClick(row)}
                        title={action.label}
                      >
                        {action.icon || action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-state">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
