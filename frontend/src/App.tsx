import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import CafesPage from '@/pages/cafes/CafesPage';
import CafeFormPage from '@/pages/cafes/CafeFormPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/cafes" replace /> },
  {
    element: <Layout />,
    children: [
      { path: '/cafes', element: <CafesPage /> },
      { path: '/cafes/new', element: <CafeFormPage /> },
      { path: '/cafes/:id/edit', element: <CafeFormPage /> },
      { path: '/employees', element: <div>Employees Page — coming soon</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
