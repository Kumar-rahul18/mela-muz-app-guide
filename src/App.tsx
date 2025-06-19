
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PhotoContest from "./pages/PhotoContest";
import LiveDarshan from "./pages/LiveDarshan";
import CrowdStatus from "./pages/CrowdStatus";
import FacilityDetail from "./pages/FacilityDetail";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/facility/:type" element={<FacilityDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
