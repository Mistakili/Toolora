import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "./middlewares/x402";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

// ── Agent discovery routes ──────────────────────────────────────────────────
// Agents and crawlers look here first. Always free, no auth required.

app.get("/.well-known/agent.json", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    name: "Toolora Agent API",
    version: "1.0.0",
    manifestUrl: `${_req.protocol}://${_req.get("host")}/api/agent`,
    docsUrl: `${_req.protocol}://${_req.get("host")}/api-docs`,
    payment: { protocol: "x402", network: `stellar:${NETWORK}`, asset: "XLM", pricePerRequest: PRICE_XLM, payTo: RECEIVER_ADDRESS },
    endpoints: [
      { id: "pdf.text", method: "POST", path: "/api/agent/pdf/text", paid: true },
      { id: "url.read", method: "POST", path: "/api/agent/url/read", paid: true },
    ],
  });
});

app.get("/robots.txt", (_req: Request, res: Response) => {
  res.type("text/plain").send([
    "User-agent: *",
    "Allow: /api/agent",
    "Allow: /.well-known/agent.json",
    "",
    "# Toolora Agent API — paid document processing endpoints for AI agents",
    "# Discovery: GET /api/agent",
    "# Full docs: /api-docs",
  ].join("\n"));
});

export default app;
