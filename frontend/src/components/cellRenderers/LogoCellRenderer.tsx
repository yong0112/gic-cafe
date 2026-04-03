import type { CustomCellRendererProps } from 'ag-grid-react';

export default function LogoCellRenderer({ value }: CustomCellRendererProps) {
  if (!value) return <span style={{ color: '#bbb' }}>—</span>;
  return (
    <img
      src={`/${value}`}
      alt="logo"
      style={{ height: 36, width: 36, objectFit: 'cover', borderRadius: 4 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
