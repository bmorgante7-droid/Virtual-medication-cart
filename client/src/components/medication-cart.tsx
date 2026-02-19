import { motion } from "framer-motion";
import type { Drawer } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MedicationCartProps {
  drawers: Drawer[];
  openDrawerId: string | null;
  onDrawerToggle: (drawerId: string) => void;
}

const DRAWER_COLORS: Record<string, { bg: string; handle: string; label: string }> = {
  "#EF4444": { bg: "bg-red-500/10 dark:bg-red-500/15", handle: "bg-red-500", label: "text-red-700 dark:text-red-400" },
  "#F59E0B": { bg: "bg-amber-500/10 dark:bg-amber-500/15", handle: "bg-amber-500", label: "text-amber-700 dark:text-amber-400" },
  "#3B82F6": { bg: "bg-blue-500/10 dark:bg-blue-500/15", handle: "bg-blue-500", label: "text-blue-700 dark:text-blue-400" },
  "#10B981": { bg: "bg-emerald-500/10 dark:bg-emerald-500/15", handle: "bg-emerald-500", label: "text-emerald-700 dark:text-emerald-400" },
  "#8B5CF6": { bg: "bg-violet-500/10 dark:bg-violet-500/15", handle: "bg-violet-500", label: "text-violet-700 dark:text-violet-400" },
  "#6B7280": { bg: "bg-gray-500/10 dark:bg-gray-500/15", handle: "bg-gray-500", label: "text-gray-700 dark:text-gray-400" },
  "#EC4899": { bg: "bg-pink-500/10 dark:bg-pink-500/15", handle: "bg-pink-500", label: "text-pink-700 dark:text-pink-400" },
};

function getDrawerColors(color: string) {
  return DRAWER_COLORS[color] || DRAWER_COLORS["#6B7280"];
}

export function MedicationCart({ drawers, openDrawerId, onDrawerToggle }: MedicationCartProps) {
  const sortedDrawers = [...drawers].sort((a, b) => a.position - b.position);

  return (
    <div className="relative" data-testid="medication-cart">
      <div className="w-[320px] sm:w-[360px] relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[85%] h-3 rounded-t-md bg-gradient-to-b from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700" />

        <div className="relative bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/5 dark:from-white/5 dark:to-black/10 pointer-events-none" />

          <div className="p-2 space-y-1 relative">
            {sortedDrawers.map((drawer) => {
              const isOpen = openDrawerId === drawer.id;
              const colors = getDrawerColors(drawer.color);
              const isLarge = drawer.size === "large";

              return (
                <motion.button
                  key={drawer.id}
                  data-testid={`button-drawer-${drawer.position}`}
                  className={cn(
                    "w-full relative rounded-md border transition-colors cursor-pointer",
                    "border-gray-300/80 dark:border-gray-600/80",
                    isOpen
                      ? "bg-gray-50 dark:bg-gray-900 border-primary/50 ring-1 ring-primary/30"
                      : "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800",
                    isLarge ? "min-h-[80px]" : "min-h-[56px]"
                  )}
                  onClick={() => onDrawerToggle(drawer.id)}
                  whileTap={{ scale: 0.99 }}
                  layout
                >
                  <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/30 to-transparent dark:from-white/5 pointer-events-none" />

                  <div className="absolute top-1 left-2 flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", colors.handle)} />
                    <span className={cn("text-[10px] font-semibold uppercase tracking-wider", colors.label)}>
                      {drawer.label}
                    </span>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className={cn(
                      "h-[6px] rounded-full transition-all",
                      isOpen ? "w-12 bg-primary" : "w-10 bg-gray-400 dark:bg-gray-500"
                    )} />
                  </div>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-1 left-1/2 -translate-x-1/2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </motion.div>
                  )}

                  <div className={cn(
                    "absolute inset-y-0 left-0 w-[3px] rounded-l-md",
                    colors.handle
                  )} />
                </motion.button>
              );
            })}
          </div>

          <div className="h-3 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-t border-gray-300/50 dark:border-gray-600/50" />
        </div>

        <div className="flex justify-between px-8 mt-1">
          <div className="w-4 h-6 bg-gray-400 dark:bg-gray-600 rounded-b-md" />
          <div className="w-4 h-6 bg-gray-400 dark:bg-gray-600 rounded-b-md" />
        </div>

        <div className="flex justify-between px-6 -mt-1">
          <div className="w-6 h-3 bg-gray-500 dark:bg-gray-500 rounded-b-full" />
          <div className="w-6 h-3 bg-gray-500 dark:bg-gray-500 rounded-b-full" />
        </div>
      </div>
    </div>
  );
}
