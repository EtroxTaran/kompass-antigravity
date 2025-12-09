import { useState, useEffect } from "react";
import {
  X,
  Rocket,
  Users,
  TrendingUp,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WELCOME_SHOWN_KEY = "kompass_welcome_shown";

interface WelcomeStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

const welcomeSteps: WelcomeStep[] = [
  {
    title: "Kunden verwalten",
    description:
      "Verwalten Sie Ihre Kundendaten, Kontakte und Standorte an einem Ort.",
    icon: Users,
  },
  {
    title: "Vertrieb optimieren",
    description:
      "Nutzen Sie das Opportunity-Board um Ihre Verkaufschancen zu verfolgen.",
    icon: TrendingUp,
  },
  {
    title: "Projekte steuern",
    description:
      "Behalten Sie den Überblick über laufende Projekte und Aufgaben.",
    icon: Briefcase,
  },
];

interface WelcomeModalProps {
  userName?: string;
  onComplete?: () => void;
}

export function WelcomeModal({
  userName = "Benutzer",
  onComplete,
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if welcome has been shown
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    setIsOpen(false);
    onComplete?.();
  };

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const CurrentIcon = welcomeSteps[currentStep]?.icon || Rocket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            {currentStep === 0 ? (
              <Rocket className="w-8 h-8" />
            ) : (
              <CurrentIcon className="w-8 h-8" />
            )}
          </div>
          {currentStep === 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Willkommen bei KOMPASS, {userName}!
              </h2>
              <p className="text-white/80">
                Ihr intelligentes Werkzeug für CRM, Vertrieb und
                Projektmanagement.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">
                {welcomeSteps[currentStep].title}
              </h2>
              <p className="text-white/80">
                {welcomeSteps[currentStep].description}
              </p>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 0 && (
            <div className="space-y-3 mb-6">
              {welcomeSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {[0, ...welcomeSteps.map((_, i) => i + 1)]
              .slice(0, welcomeSteps.length + 1)
              .map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep
                      ? "bg-primary"
                      : index < currentStep
                        ? "bg-primary/50"
                        : "bg-gray-200",
                  )}
                />
              ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Überspringen
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              {currentStep < welcomeSteps.length - 1 ? (
                "Weiter"
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Los geht's
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;
