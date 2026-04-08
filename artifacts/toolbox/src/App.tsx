import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";

const Home = lazy(() => import("@/pages/Home"));
const CategoryView = lazy(() => import("@/pages/CategoryView"));
const ToolView = lazy(() => import("@/pages/ToolView"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const History = lazy(() => import("@/pages/History"));
const ApiDocs = lazy(() => import("@/pages/ApiDocs"));
const ExtensionPage = lazy(() => import("@/pages/ExtensionPage"));
const Admin = lazy(() => import("@/pages/Admin"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const ApiKeys = lazy(() => import("@/pages/ApiKeys"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const ConverterPage = lazy(() => import("@/pages/ConverterPage"));
const GlossaryPage = lazy(() => import("@/pages/GlossaryPage"));
const GlossaryIndex = lazy(() => import("@/pages/GlossaryIndex"));
const Showcase = lazy(() => import("@/pages/Showcase"));
const McpPage = lazy(() => import("@/pages/McpPage"));
const McpHub = lazy(() => import("@/pages/McpHub"));
const Enterprise = lazy(() => import("@/pages/Enterprise"));
const HipaaChecklist = lazy(() => import("@/pages/HipaaChecklist"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Paste = lazy(() => import("@/pages/Paste"));
const About = lazy(() => import("@/pages/About"));
const Integrations = lazy(() => import("@/pages/Integrations"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const GdprCompliance = lazy(() => import("@/pages/GdprCompliance"));
const ToolHowToPage = lazy(() => import("@/pages/ToolHowToPage"));
const ComparisonPage = lazy(() => import("@/pages/ComparisonPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    }
  }
});

const PageFallback = () => (
  <div style={{ minHeight: "100vh", backgroundColor: "#09090b" }} />
);

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
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
              <Route path="/welcome" component={Welcome} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/mcp" component={McpPage} />
              <Route path="/mcp-hub" component={McpHub} />
              <Route path="/about" component={About} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/gdpr" component={GdprCompliance} />
              <Route path="/enterprise" component={Enterprise} />
              <Route path="/hipaa-checklist" component={HipaaChecklist} />
              <Route path="/tools/:category" component={CategoryView} />
              <Route path="/tools/:category/:slug" component={ToolView} />
              <Route path="/convert/:slug" component={ConverterPage} />
              <Route path="/glossary" component={GlossaryIndex} />
              <Route path="/glossary/:slug" component={GlossaryPage} />
              <Route path="/how-to/:slug" component={ToolHowToPage} />
              <Route path="/compare/:slug" component={ComparisonPage} />
              <Route component={NotFound} />
            </Switch>
          </AppLayout>
        </Route>
      </Switch>
    </Suspense>
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
