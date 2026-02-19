import { Stethoscope } from "lucide-react";

export function CartHeader() {
  return (
    <header className="border-b bg-card/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight" data-testid="text-app-title">
              Medication Cart Simulator
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
              Interactive learning tool for nursing students
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
