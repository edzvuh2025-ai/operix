import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {ClerkExpressWithAuth} from "@clerk/express";
import healthRoute from "./routes/health.js";
import groupsRoute from "./routes/groups.js";
import staffRoute from "./routes/staff.js";
import casesRoute from "./routes/cases.js";
import sessionsRoute from "./routes/sessions.js";
import activityRoute from "./routes/activity.js";
import settingsRoute from "./routes/settings.js";
import {errorHandler} from "./middleware/errorHandler.js";

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✓ API running on :${PORT}`));
