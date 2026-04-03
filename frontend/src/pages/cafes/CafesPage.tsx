import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { useCafes, useDeleteCafe } from '@/hooks/useCafes';
import type { Cafe } from '@/types';
import LogoCellRenderer from '@/components/cellRenderers/LogoCellRenderer';
import EmployeeCountRenderer from '@/components/cellRenderers/EmployeeCountRenderer';
import ActionButtonsRenderer from '@/components/cellRenderers/ActionButtonsRenderer';
import styles from './CafesPage.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CafesPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const { data: cafes = [], isLoading } = useCafes(location || undefined);
  const { mutate: deleteCafe } = useDeleteCafe();

  const handleDelete = useCallback(
    (id: string) => {
      deleteCafe(id, {
        onSuccess: () => message.success('Café deleted successfully'),
        onError: (err) => message.error(err.message),
      });
    },
    [deleteCafe],
  );

  const context = useMemo(
    () => ({
      onDelete: handleDelete,
      editPath: (id: string) => `/cafes/${id}/edit`,
    }),
    [handleDelete],
  );

  const columnDefs = useMemo<ColDef<Cafe>[]>(
    () => [
      { field: 'logo', headerName: 'Logo', cellRenderer: LogoCellRenderer, width: 80, sortable: false },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
      { field: 'description', headerName: 'Description', flex: 2, minWidth: 200 },
      { field: 'employees', headerName: 'Employees', cellRenderer: EmployeeCountRenderer, width: 120 },
      { field: 'location', headerName: 'Location', flex: 1, minWidth: 120 },
      { headerName: 'Actions', cellRenderer: ActionButtonsRenderer, width: 220, sortable: false },
    ],
    [],
  );

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Cafés</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/cafes/new')}>
          Add New Café
        </Button>
      </div>

      <div className={styles.toolbar}>
        <Input
          placeholder="Filter by location..."
          prefix={<SearchOutlined />}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          allowClear
          style={{ width: 240 }}
        />
      </div>

      <div className={styles.grid}>
        <AgGridReact
          rowData={cafes}
          columnDefs={columnDefs}
          context={context}
          loading={isLoading}
          rowHeight={52}
          defaultColDef={{ suppressMovable: true }}
        />
      </div>
    </div>
  );
}
