import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";
import AboutUsPage from "./components/AboutUsPage/AboutUsPage";
import EventsPage from "./components/EventsPage/EventsPage";
import ReportPage from "./components/ReportPage/ReportPage";

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
                { path: '/events', element: <EventsPage/>},
                { path: '/report', element: <ReportPage/>},
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
