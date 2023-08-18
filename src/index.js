import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './pages/App';
import Diary from './pages/Diary'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import RootLayout from './RootLayout'
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UserPreferences from './pages/UserPreferences';
import { SiteContext } from './components/SiteContext';
import Stats from './pages/Stats';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/logout',
        element: <Logout />
      },
      {
        path: '/diary/:page',
        element: <Diary />
      },
      {
        path: '/user-preferences',
        element: <UserPreferences />
      },
      {
        path: '/stats',
        element: <Stats />
      }
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SiteContext>
      <RouterProvider router={router} />
    </SiteContext>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
