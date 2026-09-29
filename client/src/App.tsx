import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Milestones from "./pages/Milestones";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import LegalPage from "./pages/LegalPage";
import CookieNotice from "./components/CookieNotice";
import AdminPage from "./pages/AdminPage";
import Programs from "./pages/Programs";
import { SiteImagesProvider } from "./contexts/SiteImagesContext";
import Team from "./pages/Team";
import EcoTourism from "./pages/EcoTourism";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/team" component={Team} />
      <Route path="/ecotourism" component={EcoTourism} />
      <Route path="/milestones" component={Milestones} />
      <Route path="/contact" component={Contact} />
      <Route path="/projects" component={Projects} />
      <Route path="/privacy" component={() => <LegalPage page="privacy" />} />
      <Route path="/cookies" component={() => <LegalPage page="cookies" />} />
      <Route path="/terms" component={() => <LegalPage page="terms" />} />
      <Route path="/accessibility" component={() => <LegalPage page="accessibility" />} />
      <Route path="/programs" component={Programs} />
      <Route path="/admin" component={AdminPage} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <CookieNotice />
          <SiteImagesProvider><Router /></SiteImagesProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
