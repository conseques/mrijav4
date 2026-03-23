import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import AboutUsPage from "./components/AboutUsPage/AboutUsPage";
import EventsPage from "./components/EventsPage/EventsPage";

import GalleryPage from "./components/GalleryPage/GalleryPage";

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
    ]);

    return <RouterProvider router={router} />;
}

export default App;
