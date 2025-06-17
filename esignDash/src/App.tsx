import React, { Suspense, useEffect } from 'react';
import { FrappeProvider } from 'frappe-react-sdk';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import Moveable from 'react-moveable';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import HorizontalLayout from './HorizontalLayout';
import VerticalLayout from './VerticalLayout';
import Home from './pages/Home';
import BookAnimation from './loading/BookAnimation';
import BookAnimation2 from './loading/BookAnimation2';

import { useSelector, useDispatch } from 'react-redux';
import { selectEmail, selectFullName } from './redux/selectors/userSelector';
import { clearUser } from './redux/reducers/userReducerSlice';

// Lazy-loaded components
const Login = React.lazy(() => import('./pages/auth/Login_Auth'));
const SignUp = React.lazy(() => import('./pages/auth/Signin_Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Documents = React.lazy(() => import('./pages/Dashboard/Documents'));
const Inbox = React.lazy(() => import('./pages/Dashboard/Inbox'));
const Profile = React.lazy(() => import('./pages/Dashboard/Profile'));
const Sent = React.lazy(() => import('./pages/Dashboard/Sent'));
const Signature = React.lazy(() => import('./pages/Dashboard/Signature'));
const OpenSSL = React.lazy(() => import('./pages/Dashboard/OpenSSL'));
const Templete = React.lazy(() => import('./pages/Dashboard/Templete'));
const DocEdit = React.lazy(() => import('./pages/Dashboard/Document/DocEdit'));
const TempleteDash = React.lazy(() => import('./pages/Dashboard/TempleteDash'));
const TempleteEdit = React.lazy(() => import('./pages/Dashboard/templete/TempleteEdit'));
const Signer = React.lazy(() => import('./pages/Dashboard/doc_signer/Signer'));

// Protected Route Component
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const email = useSelector(selectEmail);
  const firstName = useSelector(selectFullName);

  if (!email || !firstName) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

function App() {

  /*
    ---Multi Tab Blocker Code---
  */
  // const dispatch = useDispatch();
  // const handleStorageChange = () => {
  //   const email = localStorage.getItem('persist:root') && JSON.parse(localStorage.getItem('persist:root') || '{}').email;
  //   const fullName = localStorage.getItem('persist:root') && JSON.parse(localStorage.getItem('persist:root') || '{}').full_name;
  //   // If there's no email or fullName in localStorage, it means the user has logged out in another tab
  //   if (!email || !fullName) {
  //     dispatch(clearUser()); // Dispatch logout action to update Redux store
  //   }
  // };
  // useEffect(() => {
  //   // Listen to changes in localStorage from other tabs
  //   window.addEventListener('storage', handleStorageChange);
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, [dispatch]);

  const getSiteName = () => {
    // @ts-ignore
    if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
      // @ts-ignore
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME;
    }
    return import.meta.env.VITE_SITE_NAME;
  };

  const verticalRoutes = [
    { path: '/loading', element: <BookAnimation2 /> },
    { path: '/dashboard', element: <ProtectedRoute element={<Dashboard />} /> },
    { path: '/documents', element: <ProtectedRoute element={<Documents />} /> },
    { path: '/inbox', element: <ProtectedRoute element={<Inbox />} /> },
    { path: '/profile', element: <ProtectedRoute element={<Profile />} /> },
    { path: '/sent', element: <ProtectedRoute element={<Sent />} /> },
    { path: '/signature', element: <ProtectedRoute element={<Signature />} /> },
    { path: '/openssl', element: <ProtectedRoute element={<OpenSSL />} /> },
    { path: '/trialTemp', element: <ProtectedRoute element={<Templete />} /> },
    { path: '/templete', element: <ProtectedRoute element={<TempleteDash />} /> },
    { path: '/s1', element: <ProtectedRoute element={<Templete />} /> },
  ];

  const otherRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/document/:id', element: <ProtectedRoute element={<DocEdit />} /> },
    { path: '/temp', element: <BookAnimation /> },
    { path: '/templete/:id', element: <ProtectedRoute element={<TempleteEdit />} /> },
    { path: '/signer/:id', element: <ProtectedRoute element={<Signer />} /> },
  ];

  return (
    <div className="App">
      <Moveable flushSync={flushSync} />
      <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT} siteName={getSiteName()}>
        <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
          <DndProvider backend={HTML5Backend}>
            <Routes>
              
              <Route element={<HorizontalLayout />}>
                <Route path="/" element={<Suspense fallback={<BookAnimation2 />}><Home /></Suspense>} />
              </Route>

              <Route element={<VerticalLayout />}>
                {verticalRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={<Suspense fallback={<BookAnimation2 />}>{element}</Suspense>} />
                ))}
              </Route>

              {otherRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={<Suspense fallback={<BookAnimation />}>{element}</Suspense>} />
              ))}
            </Routes>
          </DndProvider>
        </BrowserRouter>
      </FrappeProvider>
    </div>
  );
}

export default App;
