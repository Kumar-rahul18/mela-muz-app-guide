
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import History from "./pages/History";
import Events from "./pages/Events";
import CrowdStatus from "./pages/CrowdStatus";
import PhotoContest from "./pages/PhotoContest";
import VirtualPooja from "./pages/VirtualPooja";
import LiveDarshan from "./pages/LiveDarshan";
import MelaQuiz from "./pages/MelaQuiz";
import FacilityRoute from "./pages/FacilityRoute";
import FacilityDetail from "./pages/FacilityDetail";
import LostFound from "./pages/LostFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VehicleAdmin from "./pages/VehicleAdmin";
import CameraFilters from "./pages/CameraFilters";
import NotFound from "./pages/NotFound";
import Attractions from "./pages/Attractions";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/history" element={<History />} />
              <Route path="/events" element={<Events />} />
              <Route path="/crowd-status" element={<CrowdStatus />} />
              <Route path="/photo-contest" element={<PhotoContest />} />
              <Route path="/virtual-pooja" element={<VirtualPooja />} />
              <Route path="/live-darshan" element={<LiveDarshan />} />
              <Route path="/mela-quiz" element={<MelaQuiz />} />
              <Route path="/facility/route" element={<FacilityRoute />} />
              <Route path="/facility/:type" element={<FacilityDetail />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/vehicle" element={<VehicleAdmin />} />
              <Route path="/camera-filters" element={<CameraFilters />} />
              <Route path="/attractions" element={<Attractions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
