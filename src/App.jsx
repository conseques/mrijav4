import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import AboutUsPage from "./components/AboutUsPage/AboutUsPage";
import EventsPage from "./components/EventsPage/EventsPage";

import GalleryPage from "./components/GalleryPage/GalleryPage";
import Login from "./components/Admin/Login/Login";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import { VolunteerAuthProvider } from "./context/VolunteerAuthContext";
import AppRouteError from "./components/AppRouteError";
import VolunteerLogin from "./components/VolunteerPortal/Auth/Login";
import VolunteerRegister from "./components/VolunteerPortal/Auth/Register";
import VolunteerDashboard from "./components/VolunteerPortal/Dashboard/Dashboard";
import VolunteerProtectedRoute from "./components/VolunteerPortal/VolunteerProtectedRoute";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <AppRouteError />,
            element: (
                <>
                    <ScrollRestoration />
                    <Layout />
                </>
            ),
            children: [
                { index: true, element: <HomePage/>},
                { path: '/about-us', element: <AboutUsPage/>},
                { path: '/gallery', element: <GalleryPage/>},
                { path: '/events', element: <EventsPage/>},
            ],
        },
        {
            path: "/admin/login",
            errorElement: <AppRouteError />,
            element: <Login />
        },
        {
            path: "/admin/dashboard",
            errorElement: <AppRouteError />,
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            )
        },
        {
            path: "/volunteer-portal",
            errorElement: <AppRouteError />,
            element: (
                <VolunteerAuthProvider>
                    <Outlet />
                </VolunteerAuthProvider>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <VolunteerProtectedRoute>
                            <VolunteerDashboard />
                        </VolunteerProtectedRoute>
                    )
                },
                { path: "login", element: <VolunteerLogin /> },
                { path: "register", element: <VolunteerRegister /> },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
