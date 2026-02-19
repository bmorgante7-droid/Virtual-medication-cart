import { type User, type InsertUser, type Drawer, type InsertDrawer, type Medication, type InsertMedication, users, drawers, medications } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllDrawers(): Promise<Drawer[]>;
  getDrawer(id: string): Promise<Drawer | undefined>;
  createDrawer(drawer: InsertDrawer): Promise<Drawer>;
  getAllMedications(): Promise<Medication[]>;
  getMedicationsByDrawer(drawerId: string): Promise<Medication[]>;
  getMedication(id: string): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  getDrawerCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllDrawers(): Promise<Drawer[]> {
    return db.select().from(drawers).orderBy(drawers.position);
  }

  async getDrawer(id: string): Promise<Drawer | undefined> {
    const [drawer] = await db.select().from(drawers).where(eq(drawers.id, id));
    return drawer;
  }

  async createDrawer(drawer: InsertDrawer): Promise<Drawer> {
    const [created] = await db.insert(drawers).values(drawer).returning();
    return created;
  }

  async getAllMedications(): Promise<Medication[]> {
    return db.select().from(medications);
  }

  async getMedicationsByDrawer(drawerId: string): Promise<Medication[]> {
    return db.select().from(medications).where(eq(medications.drawerId, drawerId));
  }

  async getMedication(id: string): Promise<Medication | undefined> {
    const [med] = await db.select().from(medications).where(eq(medications.id, id));
    return med;
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const [created] = await db.insert(medications).values(medication).returning();
    return created;
  }

  async getDrawerCount(): Promise<number> {
    const result = await db.select().from(drawers);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
