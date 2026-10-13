import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { AutomationsList } from "./pages/AutomationsList.jsx";
import { AutomationDetail } from "./pages/AutomationDetail.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { Workflows } from "./pages/Workflows.jsx";
import { Activity } from "./pages/Activity.jsx";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
  {
    Component: Layout,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/automations", Component: AutomationsList },
      { path: "/automations/:id", Component: AutomationDetail },
      { path: "/workflows", Component: Workflows },
      { path: "/activity", Component: Activity },
      { path: "/settings", Component: SettingsPage },
    ],
  },
]);
