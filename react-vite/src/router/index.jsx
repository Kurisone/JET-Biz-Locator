import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../../../../possibly useless files/SignupFormPage';
import Layout from './Layout';
import LoginFormModal from '../components/LoginFormModal/LoginFormModal';
import SignupFormModal from '../components/SignupFormModal/SignupFormModal';
import AllBusinessesPage from '../components/Businesses/AllBusinessesPage';
import BusinessDetailPage from '../components/Businesses/BusinessDetailPage';
import AddBusinessForm from '../components/Businesses/AddBusinessForm';
import MyBusinesses from '../components/Businesses/MyBusinesses';
import EditBusinessForm from '../components/Businesses/EditBusinessForm';

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
        element: <LoginFormModal />,
      },
      {
        path: "signup",
        element: <SignupFormModal />,
      },
    ],
  },
]);
