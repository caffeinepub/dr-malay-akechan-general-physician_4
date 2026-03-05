import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Header from "./components/Header";
import { AdminEditProvider } from "./context/AdminEditContext";
import AdminPanel from "./pages/AdminPanel";
import MainPage from "./pages/MainPage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: MainPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([indexRoute]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminEditProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AdminEditProvider>
    </QueryClientProvider>
  );
}
