import Layout from "@/components/Layout";
import About from "@/pages/About";
import AdminDashboard from "@/pages/AdminDashboard";
import AgentApplication from "@/pages/AgentApplication";
import AgentDashboard from "@/pages/AgentDashboard";
import AgentProfile from "@/pages/AgentProfile";
import Agents from "@/pages/Agents";
import Booking from "@/pages/Booking";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import Help from "@/pages/Help";
import Home from "@/pages/Home";
import HouseTypeDetail from "@/pages/HouseTypeDetail";
import HouseTypes from "@/pages/HouseTypes";
import Live from "@/pages/Live";
import MapPage from "@/pages/MapPage";
import Notifications from "@/pages/Notifications";
import PostDetail from "@/pages/PostDetail";
import Posts from "@/pages/Posts";
import Privacy from "@/pages/Privacy";
import Profile from "@/pages/Profile";
import ProjectDetail from "@/pages/ProjectDetail";
import Projects from "@/pages/Projects";
import Terms from "@/pages/Terms";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Layout />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostDetail,
});

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts",
  component: Posts,
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live",
  component: Live,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Projects,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$projectId",
  component: ProjectDetail,
});

const houseTypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/house-types",
  component: HouseTypes,
});

const houseTypeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/house-types/$houseType",
  component: HouseTypeDetail,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: MapPage,
});

const agentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agents",
  component: Agents,
});

const agentProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agents/$agentId",
  component: AgentProfile,
});

const agentApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agents/apply",
  component: AgentApplication,
});

const agentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent-dashboard",
  component: AgentDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: Favorites,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: Booking,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: Notifications,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: Privacy,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: Terms,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help",
  component: Help,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  postDetailRoute,
  postsRoute,
  liveRoute,
  profileRoute,
  projectsRoute,
  projectDetailRoute,
  houseTypesRoute,
  houseTypeDetailRoute,
  mapRoute,
  agentsRoute,
  agentProfileRoute,
  agentApplicationRoute,
  agentDashboardRoute,
  adminRoute,
  favoritesRoute,
  bookingRoute,
  notificationsRoute,
  aboutRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  helpRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
