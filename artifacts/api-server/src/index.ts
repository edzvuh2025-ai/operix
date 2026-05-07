import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";
import {ClerkExpressWithAuth} from "@clerk/express";
import healthRoute from "./routes/health.js";
import groupsRoute from "./routes/groups.js";
import staffRoute from "./routes/staff.js";
import casesRoute from "./routes/cases.js";
import sessionsRoute from "./routes/sessions.js";
import activityRoute from "./routes/activity.js";
import settingsRoute from "./routes/settings.js";
import {errorHandler} from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

app.use("/api/health", healthRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/groups/:groupId/staff", staffRoute);
app.use("/api/groups/:groupId/cases", casesRoute);
app.use("/api/groups/:groupId/sessions", sessionsRoute);
app.use("/api/groups/:groupId/activity", activityRoute);
app.use("/api/groups/:groupId/settings", settingsRoute);

app.use(errorHandler);

// Serve static files from frontend build
const frontendPath = path.join(__dirname, "../../artifacts/operix/dist");
app.use(express.static(frontendPath));

// SPA fallback
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✓ API running on :${PORT}`));
