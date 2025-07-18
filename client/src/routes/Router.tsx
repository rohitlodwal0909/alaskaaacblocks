// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom'; // 🛠 make sure it's 'react-router-dom'
import Loadable from '../layouts/full/shared/loadable/Loadable';

import ProtectedRoute from 'src/components/shared/ProtectedRoute'; // ✅ Import the guard
import AuthGuard from 'src/utils/Authcard';
import Chats from 'src/views/Chat/Chats';
import Leads from 'src/views/Leadmanagement/Leads';
import SeeAllNotifications from 'src/views/Notifications/SeeAllNotifications';
import Batching from 'src/views/Batching/Batching';
import Rising from 'src/views/Rising/Rising';
import WelcomeDashboard from 'src/views/dashboard/WelcomeDashboard.tsx';
import Cutting from 'src/views/cutting/Cutting';
import AutoClave from 'src/views/autoclave/AutoClave';
import AutoclaveView from 'src/views/autoclave/AutoclaveComponent.tsx/AutoclaveView';
import Segregation from 'src/views/segregation/Segregation';

const Usermanagment = Loadable(lazy(() => import('src/views/usermanagment/Usermanagment')));

const Userprofile = Loadable(lazy(() => import('src/views/userprofile/Userprofile')));
const PermissionsTable = Loadable(lazy(() => import('src/views/permission/PermissionsTable')));

/* Layouts */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* Authentication */
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* Pages */



const Router = [
 {
  path: '/',
  element: <AuthGuard />, // Protects private pages
  children: [
    {
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <WelcomeDashboard /> },
        { path: '/user-profile/user-managment', element: <Usermanagment /> },
        { path: '/user-profile', element: <Userprofile /> },
        { path: '/Chats', element: <Chats/> },
        { path: '/notifications', element: <SeeAllNotifications/> },
        { path: '/lead-managment/leads', element: <Leads /> },
        { path: '/batching', element: <Batching /> },
        { path: '/rising', element: <Rising /> },
        { path: '/cutting', element: <Cutting /> },
        { path: '/autoclave', element: <AutoClave /> },
        { path: '/segregation', element: <Segregation/> },
        { path: '/autoclave-view/:id', element: <AutoclaveView /> },
        { path: '/permission', element: <PermissionsTable /> },
        { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    },
  ],
},
{
  path: '/',
  element: <BlankLayout />,
  children: [
    {
      path: '/admin/login',
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/register',
      element: (
        <ProtectedRoute>
          <Register />
        </ProtectedRoute>
      ),
    },
    { path: '/admin/forgot-password', element: <ForgotPassword /> },
    { path: '/admin/two-steps', element: <TwoSteps /> },
    { path: '/admin/maintenance', element: <Maintainance /> },
    { path: '/auth/404', element: <Error /> },
    { path: '*', element: <Navigate to="/auth/404" /> },
  ],
}
];

const router = createBrowserRouter(Router);
export default router;
