import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import AboutUsPage from "./components/AboutUsPage/AboutUsPage";
import EventsPage from "./components/EventsPage/EventsPage";

import GalleryPage from "./components/GalleryPage/GalleryPage";
import Login from "./components/Admin/Login/Login";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
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
            element: <Login />
        },
        {
            path: "/admin/dashboard",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            )
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
