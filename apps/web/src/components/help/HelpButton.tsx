import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { HelpCenterPanel } from "./HelpCenterPanel";

/**
 * Button to trigger the Help Center panel
 * Can be placed in the header or sidebar
 */
export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Hilfe-Center öffnen"
      >
        <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
      <HelpCenterPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default HelpButton;
