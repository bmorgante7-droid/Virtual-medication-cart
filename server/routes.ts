import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/drawers", async (_req, res) => {
    const drawers = await storage.getAllDrawers();
    res.json(drawers);
  });

  app.get("/api/drawers/:id", async (req, res) => {
    const drawer = await storage.getDrawer(req.params.id);
    if (!drawer) return res.status(404).json({ message: "Drawer not found" });
    res.json(drawer);
  });

  app.get("/api/medications", async (_req, res) => {
    const medications = await storage.getAllMedications();
    res.json(medications);
  });

  app.get("/api/medications/drawer/:drawerId", async (req, res) => {
    const medications = await storage.getMedicationsByDrawer(req.params.drawerId);
    res.json(medications);
  });

  app.get("/api/medications/:id", async (req, res) => {
    const medication = await storage.getMedication(req.params.id);
    if (!medication) return res.status(404).json({ message: "Medication not found" });
    res.json(medication);
  });

  return httpServer;
}
