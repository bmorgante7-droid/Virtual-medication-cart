import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Syringe, Droplets, Stethoscope, Shield, FileText, X, Scissors, Thermometer } from "lucide-react";
import type { Drawer, Medication } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DrawerContentsProps {
  drawer: Drawer;
  medications: Medication[];
  onMedicationClick: (med: Medication) => void;
}

const ITEM_ICONS: Record<string, typeof Pill> = {
  tablet: Pill,
  capsule: Pill,
  injection: Syringe,
  liquid: Droplets,
  topical: Droplets,
  tool: Stethoscope,
  supply: Scissors,
  monitoring: Thermometer,
};

function getItemIcon(form: string, itemType: string) {
  if (itemType === "tool" || itemType === "supply") return ITEM_ICONS[itemType] || Stethoscope;
  const lowerForm = form.toLowerCase();
  if (lowerForm.includes("tablet") || lowerForm.includes("pill")) return Pill;
  if (lowerForm.includes("capsule")) return Pill;
  if (lowerForm.includes("injection") || lowerForm.includes("syringe") || lowerForm.includes("vial")) return Syringe;
  if (lowerForm.includes("liquid") || lowerForm.includes("solution") || lowerForm.includes("IV")) return Droplets;
  return Pill;
}

const ITEM_COLORS: Record<string, string> = {
  "#3B82F6": "border-l-blue-500",
  "#EF4444": "border-l-red-500",
  "#10B981": "border-l-emerald-500",
  "#F59E0B": "border-l-amber-500",
  "#8B5CF6": "border-l-violet-500",
  "#EC4899": "border-l-pink-500",
  "#6B7280": "border-l-gray-500",
};

export function DrawerContents({ drawer, medications, onMedicationClick }: DrawerContentsProps) {
  const meds = medications.filter(m => m.itemType === "medication");
  const tools = medications.filter(m => m.itemType !== "medication");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={drawer.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-5"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold" data-testid={`text-drawer-title-${drawer.position}`}>
            {drawer.label}
          </h2>
          <Badge variant="secondary" data-testid={`badge-item-count-${drawer.position}`}>
            {medications.length} {medications.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {meds.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Medications
            </h3>
            <div className="grid gap-2">
              {meds.map((med, index) => {
                const Icon = getItemIcon(med.form, med.itemType);
                return (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "p-3 cursor-pointer hover-elevate active-elevate-2 overflow-visible transition-all",
                        "border-l-[3px]",
                        ITEM_COLORS[med.color || "#3B82F6"] || "border-l-blue-500"
                      )}
                      onClick={() => onMedicationClick(med)}
                      data-testid={`card-medication-${med.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm" data-testid={`text-med-name-${med.id}`}>
                              {med.name}
                            </span>
                            {med.controlledSubstance && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                <Shield className="w-2.5 h-2.5 mr-0.5" />
                                {med.scheduleClass || "Controlled"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {med.dosage} &middot; {med.form} &middot; {med.route}
                          </p>
                          {med.genericName && med.genericName !== med.name && (
                            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                              Generic: {med.genericName}
                            </p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0"
                          data-testid={`button-view-label-${med.id}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Tools & Supplies
            </h3>
            <div className="grid gap-2">
              {tools.map((tool, index) => {
                const Icon = getItemIcon(tool.form, tool.itemType);
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (meds.length + index) * 0.05 }}
                  >
                    <Card
                      className="p-3 cursor-pointer hover-elevate active-elevate-2 overflow-visible"
                      onClick={() => onMedicationClick(tool)}
                      data-testid={`card-tool-${tool.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-sm" data-testid={`text-tool-name-${tool.id}`}>
                            {tool.name}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {tool.dosage}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0"
                          data-testid={`button-view-tool-${tool.id}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {medications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <X className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-empty-drawer">
              This drawer is empty
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
