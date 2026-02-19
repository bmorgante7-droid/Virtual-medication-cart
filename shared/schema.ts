import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const drawers = pgTable("drawers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  position: integer("position").notNull(),
  color: text("color").notNull().default("#6B7280"),
  size: text("size").notNull().default("standard"),
});

export const medications = pgTable("medications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  drawerId: varchar("drawer_id").notNull(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  brandName: text("brand_name"),
  dosage: text("dosage").notNull(),
  form: text("form").notNull(),
  route: text("route").notNull(),
  frequency: text("frequency"),
  classification: text("classification").notNull(),
  indication: text("indication"),
  contraindications: text("contraindications"),
  sideEffects: text("side_effects"),
  nursingConsiderations: text("nursing_considerations"),
  warnings: text("warnings"),
  storage: text("storage_instructions"),
  manufacturer: text("manufacturer"),
  ndcNumber: text("ndc_number"),
  controlledSubstance: boolean("controlled_substance").default(false),
  scheduleClass: text("schedule_class"),
  color: text("color").default("#3B82F6"),
  itemType: text("item_type").notNull().default("medication"),
  prepMethod: text("prep_method"),
  prepTargetAmount: text("prep_target_amount"),
  prepTargetUnit: text("prep_target_unit"),
  prepMaxAmount: text("prep_max_amount"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDrawerSchema = createInsertSchema(drawers).omit({ id: true });
export const insertMedicationSchema = createInsertSchema(medications).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDrawer = z.infer<typeof insertDrawerSchema>;
export type Drawer = typeof drawers.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;
