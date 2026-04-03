import type { CustomCellRendererProps } from 'ag-grid-react';
import { Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ActionContext {
  onDelete: (id: string) => void;
  editPath: (id: string) => string;
}

export default function ActionButtonsRenderer({ data, context }: CustomCellRendererProps) {
  const navigate = useNavigate();
  const { onDelete, editPath } = context as ActionContext;

  return (
    <Space>
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={() => navigate(editPath(data.id))}
      >
        Edit
      </Button>
      <Popconfirm
        title="Are you sure you want to delete this?"
        onConfirm={() => onDelete(data.id)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button size="small" danger icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Popconfirm>
    </Space>
  );
}
