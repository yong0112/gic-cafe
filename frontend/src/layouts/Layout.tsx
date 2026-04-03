import { Layout as AntLayout, Menu } from 'antd';
import { ShopOutlined, TeamOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const { Sider, Content } = AntLayout;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.startsWith('/employees') ? 'employees' : 'cafes';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={styles.logo}>☕ Café Manager</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: 'cafes',
              icon: <ShopOutlined />,
              label: 'Cafés',
              onClick: () => navigate('/cafes'),
            },
            {
              key: 'employees',
              icon: <TeamOutlined />,
              label: 'Employees',
              onClick: () => navigate('/employees'),
            },
          ]}
        />
      </Sider>
      <AntLayout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
