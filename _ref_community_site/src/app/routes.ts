import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Announcements from "./components/Announcements";
import AnnouncementDetail from "./components/AnnouncementDetail";
import Projects from "./components/Projects";
import ProjectDetail from "./components/ProjectDetail";
import About from "./components/About";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "announcements", Component: Announcements },
      { path: "announcements/:id", Component: AnnouncementDetail },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "*", Component: NotFound },
    ],
  },
]);
