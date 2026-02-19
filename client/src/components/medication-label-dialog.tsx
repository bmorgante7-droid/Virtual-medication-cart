import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Info, Stethoscope, Package, Hash, FlaskConical } from "lucide-react";
import type { Medication } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MedicationLabelDialogProps {
  medication: Medication | null;
  open: boolean;
  onClose: () => void;
  onPrepareDose?: (medication: Medication) => void;
}

function getPackagingType(form: string, route: string): "vial" | "bottle" | "inhaler" | "syringe" | "tool" {
  const f = form.toLowerCase();
  const r = route.toLowerCase();
  if (f.includes("tool") || f.includes("supply") || r === "n/a") return "tool";
  if (f.includes("inhaler") || f.includes("mdi") || f.includes("nebulizer")) return "inhaler";
  if (f.includes("injection") || f.includes("vial") || f.includes("infusion") || f.includes("powder for")) return "vial";
  if (f.includes("syringe")) return "syringe";
  return "bottle";
}

function VialGraphic({ color, controlled }: { color: string; controlled: boolean }) {
  return (
    <div className="flex flex-col items-center" data-testid="graphic-vial">
      <div className="w-10 h-3 rounded-t-sm bg-gray-400 dark:bg-gray-500 relative z-10" />
      <div className="w-6 h-2 bg-gray-300 dark:bg-gray-600 relative z-10" />
      <div className="relative w-20 h-28 flex flex-col items-center">
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)`,
            backgroundColor: "rgba(200, 220, 240, 0.3)",
            border: "1px solid rgba(180, 200, 220, 0.5)",
          }}
        />
        <div className="absolute inset-x-1 top-2 bottom-2 rounded-sm bg-white dark:bg-gray-100 border border-gray-300 flex flex-col items-center justify-center px-1 py-1 overflow-hidden">
          {controlled && (
            <div className="w-full bg-red-600 text-white text-[5px] font-bold text-center py-[1px] tracking-wider">
              CII CONTROLLED
            </div>
          )}
          <div className="text-[6px] font-bold text-gray-900 text-center leading-tight mt-0.5 tracking-tight">
            Rx Only
          </div>
          <div className="w-4 h-[1px] bg-gray-300 my-[2px]" />
          <div className="text-[5px] text-gray-600 text-center leading-tight">
            FOR IV/IM USE
          </div>
          <div className="w-3 h-3 mt-1 border border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          </div>
        </div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 rounded-b-md"
          style={{
            background: "linear-gradient(to bottom, rgba(200,220,240,0.2), rgba(180,200,220,0.4))",
          }}
        />
      </div>
    </div>
  );
}

function BottleGraphic({ color, controlled }: { color: string; controlled: boolean }) {
  return (
    <div className="flex flex-col items-center" data-testid="graphic-bottle">
      <div className="w-12 h-5 rounded-t-md relative z-10" style={{ backgroundColor: controlled ? "#dc2626" : "#6B7280" }}>
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-md bg-white/20" />
      </div>
      <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 relative z-10" />
      <div className="relative w-24 h-32 flex flex-col items-center">
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.05) 100%)`,
            backgroundColor: "rgba(245, 240, 230, 0.95)",
            border: "1px solid rgba(200, 190, 170, 0.6)",
          }}
        />
        <div className="absolute inset-x-1.5 top-1.5 bottom-1.5 rounded-sm bg-white dark:bg-gray-50 border border-gray-200 flex flex-col items-center justify-center px-1.5 py-1 overflow-hidden">
          {controlled && (
            <div className="w-full bg-red-600 text-white text-[5px] font-bold text-center py-[1px] tracking-wider mb-0.5">
              CONTROLLED SUBSTANCE
            </div>
          )}
          <div className="w-full flex justify-between items-center px-0.5">
            <div className="text-[5px] font-bold text-gray-700">Rx Only</div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          </div>
          <div className="w-full h-[1px] bg-gray-200 my-[2px]" />
          <div className="text-[6px] font-black text-gray-900 text-center leading-tight tracking-tight">
            ORAL USE ONLY
          </div>
          <div className="w-full h-[1px] bg-gray-200 my-[2px]" />
          <div className="text-[5px] text-gray-500 text-center leading-tight">
            Keep out of reach<br />of children
          </div>
          <div className="mt-1 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InhalerGraphic({ color }: { color: string }) {
  return (
    <div className="flex flex-col items-center" data-testid="graphic-inhaler">
      <div className="relative w-16 h-36 flex flex-col items-center">
        <div className="w-8 h-10 rounded-t-md bg-gray-400 dark:bg-gray-500 relative">
          <div className="absolute inset-x-0 top-0 h-2 rounded-t-md bg-gray-300 dark:bg-gray-400" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 rounded-t-sm bg-gray-500 dark:bg-gray-600" />
        </div>
        <div
          className="w-14 h-22 rounded-md relative flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${color}dd 0%, ${color}aa 100%)`,
          }}
        >
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-white/20 to-transparent" />
          <div className="mt-2 mx-1.5 bg-white/90 rounded-sm p-1 flex-1 w-[calc(100%-12px)]">
            <div className="text-[5px] font-bold text-gray-900 text-center leading-tight">
              Rx Only
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-[2px]" />
            <div className="text-[5px] text-gray-600 text-center leading-tight">
              INHALATION<br />USE ONLY
            </div>
            <div className="text-[4px] text-gray-400 text-center mt-1">
              Shake well<br />before use
            </div>
          </div>
          <div className="w-12 h-5 rounded-b-lg mt-auto" style={{ backgroundColor: `${color}cc` }} />
        </div>
      </div>
    </div>
  );
}

function ToolGraphic() {
  return (
    <div className="flex flex-col items-center" data-testid="graphic-tool">
      <div className="relative w-24 h-28 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-3">
        <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600" />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
        <div className="text-[7px] font-semibold text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wider">
          Medical Device
        </div>
      </div>
    </div>
  );
}

function LabelSection({ icon: Icon, title, content, variant = "default" }: {
  icon: typeof Info;
  title: string;
  content: string | null | undefined;
  variant?: "default" | "warning" | "danger";
}) {
  if (!content) return null;

  return (
    <div className={cn(
      "rounded-md p-3",
      variant === "warning" && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50",
      variant === "danger" && "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50",
      variant === "default" && "bg-muted/50"
    )}>
      <div className="flex items-start gap-2">
        <Icon className={cn(
          "w-4 h-4 mt-0.5 flex-shrink-0",
          variant === "warning" && "text-amber-600 dark:text-amber-400",
          variant === "danger" && "text-red-600 dark:text-red-400",
          variant === "default" && "text-muted-foreground"
        )} />
        <div className="min-w-0">
          <p className={cn(
            "text-xs font-semibold uppercase tracking-wider mb-1",
            variant === "warning" && "text-amber-700 dark:text-amber-400",
            variant === "danger" && "text-red-700 dark:text-red-400",
            variant === "default" && "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className="text-sm leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MedicationLabelDialog({ medication, open, onClose, onPrepareDose }: MedicationLabelDialogProps) {
  if (!medication) return null;

  const isTool = medication.itemType !== "medication";
  const packagingType = getPackagingType(medication.form, medication.route);
  const isControlled = !!medication.controlledSubstance;
  const medColor = medication.color || "#3B82F6";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden" data-testid="dialog-medication-label">
        <div className={cn(
          "relative px-6 pt-5 pb-4",
          isControlled
            ? "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-pink-950/20"
            : isTool
              ? "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900"
              : "bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30 dark:from-slate-900/50 dark:via-blue-950/30 dark:to-cyan-950/20"
        )}>
          {isControlled && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
          )}

          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 pt-1">
              {packagingType === "vial" && <VialGraphic color={medColor} controlled={isControlled} />}
              {packagingType === "bottle" && <BottleGraphic color={medColor} controlled={isControlled} />}
              {packagingType === "inhaler" && <InhalerGraphic color={medColor} />}
              {packagingType === "syringe" && <VialGraphic color={medColor} controlled={isControlled} />}
              {packagingType === "tool" && <ToolGraphic />}
            </div>

            <div className="min-w-0 flex-1">
              <DialogHeader className="space-y-1.5 text-left">
                {medication.brandName && (
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground" data-testid="text-brand">
                    {medication.brandName}
                  </p>
                )}
                <DialogTitle className="text-xl font-bold leading-tight tracking-tight" data-testid="text-label-name">
                  {medication.name}
                </DialogTitle>
                {medication.genericName && medication.genericName !== medication.name && (
                  <DialogDescription className="text-sm italic" data-testid="text-label-generic">
                    ({medication.genericName})
                  </DialogDescription>
                )}
              </DialogHeader>

              {!isTool && (
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold tracking-tight" data-testid="text-label-dosage">
                    {medication.dosage}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span data-testid="badge-form">{medication.form}</span>
                    {" \u2022 "}
                    <span data-testid="text-label-route">{medication.route}</span>
                  </p>
                  {medication.frequency && (
                    <p className="text-xs text-muted-foreground" data-testid="text-label-frequency">
                      {medication.frequency}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {isControlled && (
                  <Badge variant="destructive" className="gap-1">
                    <Shield className="w-3 h-3" />
                    {medication.scheduleClass || "Controlled"}
                  </Badge>
                )}
                <Badge variant="secondary" data-testid="badge-classification">
                  {medication.classification}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(
          "h-[3px]",
          isControlled
            ? "bg-gradient-to-r from-red-400 via-red-500 to-red-400"
            : "bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
        )} />

        <ScrollArea className="max-h-[50vh]">
          <div className="px-6 py-4 space-y-3">
            {isTool && (
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                <p className="text-sm" data-testid="text-tool-description">{medication.dosage}</p>
              </div>
            )}

            <LabelSection
              icon={Info}
              title="Indication"
              content={medication.indication}
            />

            <LabelSection
              icon={AlertTriangle}
              title="Warnings"
              content={medication.warnings}
              variant="danger"
            />

            <LabelSection
              icon={AlertTriangle}
              title="Contraindications"
              content={medication.contraindications}
              variant="warning"
            />

            <LabelSection
              icon={Info}
              title="Side Effects"
              content={medication.sideEffects}
            />

            <LabelSection
              icon={Stethoscope}
              title="Nursing Considerations"
              content={medication.nursingConsiderations}
            />

            <LabelSection
              icon={Package}
              title="Storage"
              content={medication.storage}
            />

            <Separator className="my-2" />

            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              {medication.manufacturer && (
                <div className="flex items-center gap-1.5" data-testid="text-manufacturer">
                  <Package className="w-3 h-3" />
                  <span>Mfr: {medication.manufacturer}</span>
                </div>
              )}
              {medication.ndcNumber && (
                <div className="flex items-center gap-1.5" data-testid="text-ndc">
                  <Hash className="w-3 h-3" />
                  <span>NDC: {medication.ndcNumber}</span>
                </div>
              )}
            </div>

            {!isTool && onPrepareDose && medication.prepMethod && (
              <>
                <Separator className="my-2" />
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    onClose();
                    setTimeout(() => onPrepareDose(medication), 200);
                  }}
                  data-testid="button-prepare-dose"
                >
                  <FlaskConical className="w-4 h-4" />
                  Prepare Dose
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
