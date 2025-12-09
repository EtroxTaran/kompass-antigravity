import { useState } from "react";
import {
  HelpCircle,
  X,
  ExternalLink,
  FileText,
  Video,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link?: string;
}

const helpItems: HelpItem[] = [
  {
    id: "docs",
    title: "Dokumentation",
    description: "Ausführliche Anleitungen und Tutorials",
    icon: FileText,
    link: "/help/docs",
  },
  {
    id: "videos",
    title: "Video-Tutorials",
    description: "Schritt-für-Schritt Erklärungen",
    icon: Video,
    link: "/help/videos",
  },
  {
    id: "support",
    title: "Support kontaktieren",
    description: "Hilfe vom Support-Team erhalten",
    icon: MessageCircle,
    link: "mailto:support@kompass.de",
  },
];

const faqItems = [
  {
    question: "Wie erstelle ich einen neuen Kunden?",
    answer:
      'Navigieren Sie zu Kunden → Kundenliste und klicken Sie auf "Neuer Kunde".',
  },
  {
    question: "Wie funktioniert die Offline-Synchronisierung?",
    answer:
      "KOMPASS speichert Änderungen lokal und synchronisiert automatisch, sobald eine Verbindung besteht.",
  },
  {
    question: "Wie exportiere ich meine Daten?",
    answer:
      "Öffnen Sie die Kundenliste und nutzen Sie den Export-Button für CSV oder Excel.",
  },
];

interface HelpCenterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpCenterPanel({ isOpen, onClose }: HelpCenterPanelProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Hilfe-Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Links */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Schnellzugriff
            </h3>
            <div className="space-y-2">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target={
                      item.link?.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Häufige Fragen
            </h3>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedFaq(
                        expandedFaq === item.question ? null : item.question,
                      )
                    }
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm font-medium">{item.question}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedFaq === item.question && "rotate-90",
                      )}
                    />
                  </button>
                  {expandedFaq === item.question && (
                    <div className="px-3 pb-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Version Info */}
          <section className="text-center text-xs text-gray-400 pt-4 border-t">
            <p>KOMPASS Version 1.0.0</p>
            <p className="mt-1">© 2025 KOMPASS GmbH</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterPanel;
