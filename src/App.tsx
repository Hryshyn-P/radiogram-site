import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/context/PlayerContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PodcastDetails from "./pages/PodcastDetails";
import Podcasts from "./pages/Podcasts";
import Privacy from "./pages/Privacy";
import RadioCatalog from "./pages/RadioCatalog";
import StationDetails from "./pages/StationDetails";
import Support from "./pages/Support";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <PlayerProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/radio" element={<RadioCatalog />} />
              <Route path="/radio/country/:country" element={<RadioCatalog />} />
              <Route path="/radio/tag/:tag" element={<RadioCatalog />} />
              <Route path="/radio/:slug" element={<StationDetails />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/podcasts/:id/:slug?" element={<PodcastDetails />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </PlayerProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
