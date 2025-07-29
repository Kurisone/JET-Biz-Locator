import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AllBusinessesPage from '../components/Businesses/AllBusinessesPage';
import BusinessDetailPage from '../components/Businesses/BusinessDetailPage';
import AddBusinessForm from '../components/Businesses/AddBusinessForm';
import MyBusinesses from '../components/Businesses/MyBusinesses';
import EditBusinessForm from '../components/Businesses/EditBusinessForm';
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
        path: "/businesses/new",
        element: <AddBusinessForm />,
      },
      {
        path: "/businesses/:businessId/edit",
        element: <EditBusinessForm />,
      },
      {
        path: "/my-businesses",
        element: <MyBusinesses />,
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
