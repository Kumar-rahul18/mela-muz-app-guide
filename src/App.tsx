
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import PhotoContest from "./pages/PhotoContest";
import LiveDarshan from "./pages/LiveDarshan";
import CrowdStatus from "./pages/CrowdStatus";
import FacilityDetail from "./pages/FacilityDetail";
import Events from "./pages/Events";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VehicleAdmin from "./pages/VehicleAdmin";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import FacilityRoute from "./pages/FacilityRoute";
import Gallery from './pages/Gallery';
import LostFound from './pages/LostFound';
import MelaQuiz from './pages/MelaQuiz';
import VirtualPooja from './pages/VirtualPooja';
import CameraFilters from './pages/CameraFilters';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/photo-contest" element={<PhotoContest />} />
            <Route path="/live-darshan" element={<LiveDarshan />} />
            <Route path="/crowd-status" element={<CrowdStatus />} />
            <Route path="/events" element={<Events />} />
            <Route path="/history" element={<History />} />
            <Route path="/facility/:type" element={<FacilityRoute />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/vehicle" element={<VehicleAdmin />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/mela-quiz" element={<MelaQuiz />} />
            <Route path="/virtual-pooja" element={<VirtualPooja />} />
            <Route path="/camera-filters" element={<CameraFilters />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
