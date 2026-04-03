import type { CustomCellRendererProps } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeCountRenderer({ value, data }: CustomCellRendererProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/employees?cafe=${encodeURIComponent(data.id)}`)}
      style={{
        background: 'none',
        border: 'none',
        color: '#1677ff',
        fontWeight: 600,
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'underline',
        fontSize: '0.9rem',
      }}
    >
      {value}
    </button>
  );
}
