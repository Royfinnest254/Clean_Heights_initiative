import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CookieNotice from "./components/CookieNotice";
import { SiteImagesProvider } from "./contexts/SiteImagesContext";
import SeoHead from "./components/SeoHead";
const About = lazy(() => import("./pages/About"));
const Milestones = lazy(() => import("./pages/Milestones"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const Programs = lazy(() => import("./pages/Programs"));
const Team = lazy(() => import("./pages/Team"));
const EcoTourism = lazy(() => import("./pages/EcoTourism"));
const AdminSetupPage = lazy(() => import("./pages/AdminSetupPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));

function Router() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F7F5F0] p-8 text-[#48574D]">Loading page…</main>}><Switch>
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
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:slug" component={NewsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/setup" component={AdminSetupPage} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch></Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SeoHead />
          <CookieNotice />
          <SiteImagesProvider><Router /></SiteImagesProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
