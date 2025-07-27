import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AllBusinessesPage from '../components/Businesses/AllBusinessesPage';
import BusinessDetailPage from '../components/Businesses/BusinessDetailPage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AllBusinessesPage />,
      },
      {
        path: "/businesses/:businessId",
        element: <BusinessDetailPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
