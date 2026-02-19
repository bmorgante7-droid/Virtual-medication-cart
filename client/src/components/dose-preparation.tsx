import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Syringe, GlassWater, Check, X, RotateCcw, ArrowLeft } from "lucide-react";
import type { Medication } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DosePreparationProps {
  medication: Medication | null;
  open: boolean;
  onClose: () => void;
}

type DeliveryMethod = "syringe" | "cup" | null;
type PrepState = "choose" | "fill" | "result";

function parseDosageInfo(medication: Medication): {
  targetAmount: number;
  unit: string;
  isSyringe: boolean;
  isCup: boolean;
  maxAmount: number;
  stepSize: number;
  tabletCount?: number;
  hasPrepData: boolean;
} {
  if (medication.prepMethod && medication.prepTargetAmount && medication.prepTargetUnit) {
    const method = medication.prepMethod;
    const target = parseFloat(medication.prepTargetAmount);
    const unit = medication.prepTargetUnit;
    const max = medication.prepMaxAmount ? parseFloat(medication.prepMaxAmount) : (method === "syringe" ? 10 : 6);
    const isSyringe = method === "syringe";
    const isCup = method === "cup";

    return {
      targetAmount: target,
      unit,
      isSyringe,
      isCup,
      maxAmount: max,
      stepSize: isSyringe ? 0.5 : 1,
      tabletCount: isCup ? target : undefined,
      hasPrepData: true,
    };
  }

  return {
    targetAmount: 0,
    unit: "",
    isSyringe: false,
    isCup: false,
    maxAmount: 0,
    stepSize: 1,
    hasPrepData: false,
  };
}

function SyringeFill({ targetAmount, maxAmount, stepSize, currentAmount, onAmountChange }: {
  targetAmount: number;
  maxAmount: number;
  stepSize: number;
  currentAmount: number;
  onAmountChange: (amount: number) => void;
}) {
  const syringeRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const fillPercent = (currentAmount / maxAmount) * 100;

  const tickMarks = [];
  for (let i = 0; i <= maxAmount; i += stepSize) {
    const val = Math.round(i * 10) / 10;
    tickMarks.push(val);
  }

  const handleInteraction = useCallback((clientY: number) => {
    if (!syringeRef.current) return;
    const rect = syringeRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const fraction = 1 - (relativeY / rect.height);
    const clamped = Math.max(0, Math.min(1, fraction));
    const rawAmount = clamped * maxAmount;
    const snapped = Math.round(rawAmount / stepSize) * stepSize;
    const rounded = Math.round(snapped * 10) / 10;
    onAmountChange(Math.min(rounded, maxAmount));
  }, [maxAmount, stepSize, onAmountChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleInteraction(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleInteraction(e.clientY);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleInteraction(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      handleInteraction(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex items-end gap-6 justify-center py-4" data-testid="syringe-fill">
      <div className="flex flex-col items-center">
        <div className="w-4 h-6 bg-gray-400 dark:bg-gray-500 rounded-t-sm relative z-10" />
        <div className="w-2 h-16 bg-gray-300 dark:bg-gray-600 relative z-10">
          <div className="absolute -left-3 top-0 w-8 h-3 bg-gray-400 dark:bg-gray-500 rounded-sm" />
        </div>

        <div className="relative w-16 flex">
          <div className="absolute -left-8 top-0 bottom-0 w-6 flex flex-col justify-between py-1 items-end pr-1">
            {tickMarks.filter((_, i) => i % 2 === 0).reverse().map((val) => (
              <div key={val} className="flex items-center gap-1">
                <span className="text-[9px] text-muted-foreground font-mono tabular-nums">{val}</span>
                <div className="w-1.5 h-[1px] bg-gray-400" />
              </div>
            ))}
          </div>

          <div
            ref={syringeRef}
            className="relative w-16 h-56 rounded-b-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-pointer overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            data-testid="syringe-barrel"
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-300/90 to-amber-200/70 dark:from-amber-500/60 dark:to-amber-400/40"
              style={{ height: `${fillPercent}%` }}
              animate={{ height: `${fillPercent}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400/50 dark:bg-amber-300/30" />
            </motion.div>

            <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
              {tickMarks.reverse().map((val) => (
                <div key={`tick-${val}`} className="w-full flex items-center">
                  <div className={cn(
                    "h-[1px]",
                    Number.isInteger(val) ? "w-3 bg-gray-400" : "w-2 bg-gray-300"
                  )} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-7 top-0 bottom-0 flex items-center">
            <span className="text-xs font-mono text-muted-foreground">mL</span>
          </div>
        </div>

        <div className="w-8 h-2 bg-gray-300 dark:bg-gray-600 rounded-b-md" />
      </div>

      <div className="flex flex-col items-center gap-3 pb-8">
        <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-syringe-amount">
          {currentAmount.toFixed(1)}
        </p>
        <p className="text-sm text-muted-foreground">mL drawn</p>
        <div className="flex items-center gap-3 mt-1">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onAmountChange(Math.max(0, Math.round((currentAmount - stepSize) * 10) / 10))}
            disabled={currentAmount <= 0}
            data-testid="button-syringe-decrease"
          >
            <span className="text-lg font-bold">-</span>
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{stepSize} mL</span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onAmountChange(Math.min(maxAmount, Math.round((currentAmount + stepSize) * 10) / 10))}
            disabled={currentAmount >= maxAmount}
            data-testid="button-syringe-increase"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use buttons or drag on<br />the syringe to fill
        </p>
      </div>
    </div>
  );
}

function TabletCup({ targetCount, maxCount, currentCount, onCountChange }: {
  targetCount: number;
  maxCount: number;
  currentCount: number;
  onCountChange: (count: number) => void;
}) {
  const tabletPositions = [
    { x: 50, y: 70 },
    { x: 35, y: 55 },
    { x: 65, y: 55 },
    { x: 50, y: 40 },
    { x: 35, y: 25 },
    { x: 65, y: 25 },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-4" data-testid="tablet-cup">
      <div className="relative w-36 h-44">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(200, 10%, 85%)" />
              <stop offset="30%" stopColor="hsl(200, 10%, 95%)" />
              <stop offset="70%" stopColor="hsl(200, 10%, 90%)" />
              <stop offset="100%" stopColor="hsl(200, 10%, 80%)" />
            </linearGradient>
            <linearGradient id="cupGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(200, 10%, 25%)" />
              <stop offset="30%" stopColor="hsl(200, 10%, 35%)" />
              <stop offset="70%" stopColor="hsl(200, 10%, 30%)" />
              <stop offset="100%" stopColor="hsl(200, 10%, 20%)" />
            </linearGradient>
          </defs>

          <path
            d="M15 15 L10 105 Q10 115 20 115 L80 115 Q90 115 90 105 L85 15 Z"
            className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
            strokeWidth="1.5"
          />

          <path
            d="M20 15 L15 20 L85 20 L80 15"
            className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"
            strokeWidth="0.5"
          />

          {[30, 50, 70, 90].map((y, i) => (
            <g key={y}>
              <line
                x1={18 + (y - 15) * 0.05}
                y1={y}
                x2={30 + (y - 15) * 0.05}
                y2={y}
                className="stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="0.5"
              />
              <text
                x={33 + (y - 15) * 0.05}
                y={y + 2.5}
                className="fill-gray-400 dark:fill-gray-500"
                fontSize="5"
                fontFamily="monospace"
              >
                {(4 - i) * 10} mL
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute inset-0" data-testid="cup-tablets-area">
          <AnimatePresence>
            {Array.from({ length: currentCount }).map((_, i) => {
              const pos = tabletPositions[i] || { x: 50, y: 50 };
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: -40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: i === currentCount - 1 ? 0 : 0,
                  }}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  data-testid={`tablet-${i}`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-gray-200 dark:from-gray-300 dark:to-gray-400 border border-gray-300 dark:border-gray-500 shadow-sm relative">
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-300 dark:bg-gray-500" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onCountChange(Math.max(0, currentCount - 1))}
          disabled={currentCount <= 0}
          data-testid="button-remove-tablet"
        >
          <span className="text-lg font-bold">-</span>
        </Button>
        <div className="text-center min-w-[80px]">
          <p className="text-3xl font-bold font-mono tabular-nums" data-testid="text-tablet-count">
            {currentCount}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentCount === 1 ? "tablet" : "tablets"}
          </p>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => onCountChange(Math.min(maxCount, currentCount + 1))}
          disabled={currentCount >= maxCount}
          data-testid="button-add-tablet"
        >
          <span className="text-lg font-bold">+</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Use + and - to add or remove tablets
      </p>
    </div>
  );
}

export function DosePreparation({ medication, open, onClose }: DosePreparationProps) {
  const [step, setStep] = useState<PrepState>("choose");
  const [method, setMethod] = useState<DeliveryMethod>(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!medication || medication.itemType !== "medication" || !medication.prepMethod) return null;

  const dosageInfo = parseDosageInfo(medication);
  if (!dosageInfo.hasPrepData) return null;

  const handleReset = () => {
    setStep("choose");
    setMethod(null);
    setCurrentAmount(0);
    setShowResult(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleMethodSelect = (m: DeliveryMethod) => {
    setMethod(m);
    setCurrentAmount(0);
    setStep("fill");
  };

  const handleSubmit = () => {
    setShowResult(true);
    setStep("result");
  };

  const isCorrect = Math.abs(currentAmount - dosageInfo.targetAmount) < 0.01;

  const canChooseSyringe = dosageInfo.isSyringe;
  const canChooseCup = dosageInfo.isCup;
  const correctMethod = dosageInfo.isSyringe && !dosageInfo.isCup ? "syringe" : !dosageInfo.isSyringe && dosageInfo.isCup ? "cup" : null;
  const methodIsCorrect = correctMethod === null || method === correctMethod;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden" data-testid="dialog-dose-prep">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 px-6 pt-5 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {step !== "choose" && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReset}
                data-testid="button-back-choose"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Dose Preparation
              </p>
              <h2 className="text-lg font-bold leading-tight" data-testid="text-prep-med-name">
                {medication.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-prep-dosage">
                Ordered: {medication.dosage} &middot; {medication.route}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-600" />

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {step === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-center">
                  Choose your delivery method:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-md border-2 transition-all cursor-pointer",
                      "hover-elevate active-elevate-2",
                      !canChooseSyringe && "opacity-40 pointer-events-none",
                      "border-gray-200 dark:border-gray-700 bg-card"
                    )}
                    onClick={() => handleMethodSelect("syringe")}
                    disabled={!canChooseSyringe}
                    data-testid="button-choose-syringe"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                      <Syringe className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Syringe</span>
                    <span className="text-[11px] text-muted-foreground">For liquids & injectables</span>
                  </button>

                  <button
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-md border-2 transition-all cursor-pointer",
                      "hover-elevate active-elevate-2",
                      !canChooseCup && "opacity-40 pointer-events-none",
                      "border-gray-200 dark:border-gray-700 bg-card"
                    )}
                    onClick={() => handleMethodSelect("cup")}
                    disabled={!canChooseCup}
                    data-testid="button-choose-cup"
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                      <GlassWater className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Medication Cup</span>
                    <span className="text-[11px] text-muted-foreground">For tablets & capsules</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === "fill" && method === "syringe" && (
              <motion.div
                key="syringe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-sm text-center text-muted-foreground">
                  Draw up the correct dose of <span className="font-medium text-foreground">{medication.dosage}</span>
                </p>
                <SyringeFill
                  targetAmount={dosageInfo.targetAmount}
                  maxAmount={dosageInfo.maxAmount}
                  stepSize={dosageInfo.stepSize}
                  currentAmount={currentAmount}
                  onAmountChange={setCurrentAmount}
                />
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={currentAmount === 0}
                  data-testid="button-submit-dose"
                >
                  Check My Dose
                </Button>
              </motion.div>
            )}

            {step === "fill" && method === "cup" && (
              <motion.div
                key="cup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-sm text-center text-muted-foreground">
                  Add the correct number of tablets for <span className="font-medium text-foreground">{medication.dosage}</span>
                </p>
                <TabletCup
                  targetCount={dosageInfo.tabletCount || dosageInfo.targetAmount}
                  maxCount={dosageInfo.maxAmount}
                  currentCount={currentAmount}
                  onCountChange={setCurrentAmount}
                />
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={currentAmount === 0}
                  data-testid="button-submit-dose"
                >
                  Check My Dose
                </Button>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <div className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-md",
                  isCorrect && methodIsCorrect
                    ? "bg-emerald-50 dark:bg-emerald-950/30"
                    : "bg-red-50 dark:bg-red-950/30"
                )}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center",
                      isCorrect && methodIsCorrect
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    )}
                  >
                    {isCorrect && methodIsCorrect ? (
                      <Check className="w-7 h-7 text-white" />
                    ) : (
                      <X className="w-7 h-7 text-white" />
                    )}
                  </motion.div>

                  <div className="text-center">
                    <h3 className={cn(
                      "text-lg font-bold",
                      isCorrect && methodIsCorrect
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-700 dark:text-red-400"
                    )} data-testid="text-result-title">
                      {isCorrect && methodIsCorrect ? "Correct!" : "Not Quite Right"}
                    </h3>

                    {!methodIsCorrect && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1" data-testid="text-wrong-method">
                        A {correctMethod === "syringe" ? "syringe" : "medication cup"} would be the correct delivery method for this medication.
                      </p>
                    )}

                    {!isCorrect && (
                      <p className="text-sm mt-1" data-testid="text-wrong-amount">
                        You prepared{" "}
                        <span className="font-bold">
                          {method === "cup"
                            ? `${currentAmount} ${currentAmount === 1 ? "tablet" : "tablets"}`
                            : `${currentAmount.toFixed(1)} mL`
                          }
                        </span>
                        . The correct dose is{" "}
                        <span className="font-bold">
                          {method === "cup"
                            ? `${dosageInfo.targetAmount} ${dosageInfo.targetAmount === 1 ? "tablet" : "tablets"}`
                            : `${dosageInfo.targetAmount.toFixed(1)} mL`
                          }
                        </span>.
                      </p>
                    )}

                    {isCorrect && methodIsCorrect && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1" data-testid="text-correct-message">
                        You correctly prepared {medication.dosage} using a {method === "syringe" ? "syringe" : "medication cup"}.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleReset}
                    data-testid="button-try-again"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleClose}
                    data-testid="button-done"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
