import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";

import Home from "@/pages/Home";
import CategoryView from "@/pages/CategoryView";
import ToolView from "@/pages/ToolView";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import History from "@/pages/History";
import ApiDocs from "@/pages/ApiDocs";
import ExtensionPage from "@/pages/ExtensionPage";
import Admin from "@/pages/Admin";
import Pricing from "@/pages/Pricing";
import ApiKeys from "@/pages/ApiKeys";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ConverterPage from "@/pages/ConverterPage";
import GlossaryPage from "@/pages/GlossaryPage";
import GlossaryIndex from "@/pages/GlossaryIndex";
import Showcase from "@/pages/Showcase";
import McpPage from "@/pages/McpPage";
import McpHub from "@/pages/McpHub";
import Enterprise from "@/pages/Enterprise";
import HipaaChecklist from "@/pages/HipaaChecklist";
import NotFound from "@/pages/not-found";
import Paste from "@/pages/Paste";
import About from "@/pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    }
  }
});

function Router() {
  return (
    <Switch>
      {/* Standalone pages — no header/footer */}
      <Route path="/showcase" component={Showcase} />
      <Route path="/p/:id" component={Paste} />

      {/* All other pages — wrapped in AppLayout */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/history" component={History} />
            <Route path="/api-docs" component={ApiDocs} />
            <Route path="/extension" component={ExtensionPage} />
            <Route path="/admin" component={Admin} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/api-keys" component={ApiKeys} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/mcp" component={McpPage} />
            <Route path="/mcp-hub" component={McpHub} />
            <Route path="/about" component={About} />
            <Route path="/enterprise" component={Enterprise} />
            <Route path="/hipaa-checklist" component={HipaaChecklist} />
            <Route path="/tools/:category" component={CategoryView} />
            <Route path="/tools/:category/:slug" component={ToolView} />
            <Route path="/convert/:slug" component={ConverterPage} />
            <Route path="/glossary" component={GlossaryIndex} />
            <Route path="/glossary/:slug" component={GlossaryPage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="toolora-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
