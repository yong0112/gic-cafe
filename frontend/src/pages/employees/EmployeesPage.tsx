import { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { useEmployees, useDeleteEmployee } from '@/hooks/useEmployees';
import type { Employee } from '@/types';
import ActionButtonsRenderer from '@/components/cellRenderers/ActionButtonsRenderer';
import styles from './EmployeesPage.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeFilter = searchParams.get('cafe') ?? undefined;

  const { data: employees = [], isLoading } = useEmployees(cafeFilter);
  const { mutate: deleteEmployee } = useDeleteEmployee();

  const handleDelete = useCallback(
    (id: string) => {
      deleteEmployee(id, {
        onSuccess: () => message.success('Employee deleted successfully'),
        onError: (err) => message.error(err.message),
      });
    },
    [deleteEmployee],
  );

  const context = useMemo(
    () => ({
      onDelete: handleDelete,
      editPath: (id: string) => `/employees/${id}/edit`,
    }),
    [handleDelete],
  );

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: 'id', headerName: 'Employee ID', width: 140 },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
      { field: 'email_address', headerName: 'Email', flex: 1, minWidth: 180 },
      { field: 'phone_number', headerName: 'Phone', width: 120 },
      { field: 'days_worked', headerName: 'Days Worked', width: 130 },
      { field: 'cafe', headerName: 'Café', flex: 1, minWidth: 120 },
      { headerName: 'Actions', cellRenderer: ActionButtonsRenderer, width: 220, sortable: false },
    ],
    [],
  );

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {cafeFilter ? `Employees — ${cafeFilter}` : 'Employees'}
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/new')}>
          Add New Employee
        </Button>
      </div>

      <div className={styles.grid}>
        <AgGridReact
          rowData={employees}
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
