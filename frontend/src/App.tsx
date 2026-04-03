import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/cafes" replace /> },
  {
    element: <Layout />,
    children: [
      { path: '/cafes', element: <div>Cafés Page — coming soon</div> },
      { path: '/employees', element: <div>Employees Page — coming soon</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
