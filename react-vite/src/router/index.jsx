import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../../../../possibly useless files/SignupFormPage';
import Layout from './Layout';
import LoginFormModal from '../components/LoginFormModal/LoginFormModal';
import SignupFormModal from '../components/SignupFormModal/SignupFormModal';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome to JET-Biz-Locator!</h1>,
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