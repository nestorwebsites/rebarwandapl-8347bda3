import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Home from "./pages/Home";
import LiveFeed from "./pages/LiveFeed";
import Highlights from "./pages/Highlights";
import Trainings from "./pages/Trainings";
import Shorts from "./pages/Shorts";
import International from "./pages/International";
import SettingsPage from "./pages/Settings";
import Admin from "./pages/Admin";
import Queued from "./pages/Queued";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/livefeed" element={<LiveFeed />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/international" element={<International />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/queued" element={<Queued />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
