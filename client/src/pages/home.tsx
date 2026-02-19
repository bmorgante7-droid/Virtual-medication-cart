import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MedicationCart } from "@/components/medication-cart";
import { MedicationLabelDialog } from "@/components/medication-label-dialog";
import { DrawerContents } from "@/components/drawer-contents";
import { DosePreparation } from "@/components/dose-preparation";
import { CartHeader } from "@/components/cart-header";
import type { Drawer, Medication } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [preparingMedication, setPreparingMedication] = useState<Medication | null>(null);

  const { data: drawers, isLoading: drawersLoading } = useQuery<Drawer[]>({
    queryKey: ["/api/drawers"],
  });

  const { data: medications, isLoading: medsLoading } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
  });

  const isLoading = drawersLoading || medsLoading;

  const handleDrawerToggle = (drawerId: string) => {
    setOpenDrawerId(prev => prev === drawerId ? null : drawerId);
  };

  const handleMedicationClick = (med: Medication) => {
    setSelectedMedication(med);
  };

  const handlePrepareDose = (med: Medication) => {
    setPreparingMedication(med);
  };

  const getDrawerMedications = (drawerId: string) => {
    return medications?.filter(m => m.drawerId === drawerId) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <CartHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6">
            <Skeleton className="w-full max-w-md h-[600px] rounded-md" />
          </div>
        ) : !drawers?.length ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-lg" data-testid="text-empty-state">
              No medication cart data available.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start flex-shrink-0">
              <MedicationCart
                drawers={drawers}
                openDrawerId={openDrawerId}
                onDrawerToggle={handleDrawerToggle}
              />
            </div>

            <div className="w-full lg:flex-1 min-w-0">
              {openDrawerId ? (
                <DrawerContents
                  drawer={drawers.find(d => d.id === openDrawerId)!}
                  medications={getDrawerMedications(openDrawerId)}
                  onMedicationClick={handleMedicationClick}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3" data-testid="text-select-drawer">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-center max-w-xs">
                    Click on a drawer to view its contents
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <MedicationLabelDialog
        medication={selectedMedication}
        open={!!selectedMedication}
        onClose={() => setSelectedMedication(null)}
        onPrepareDose={handlePrepareDose}
      />

      <DosePreparation
        medication={preparingMedication}
        open={!!preparingMedication}
        onClose={() => setPreparingMedication(null)}
      />
    </div>
  );
}
