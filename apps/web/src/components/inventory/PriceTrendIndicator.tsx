import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface PriceTrendIndicatorProps {
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function PriceTrendIndicator({
  trend,
  className = "",
}: PriceTrendIndicatorProps) {
  if (!trend) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ${className}`}>
            {trend === "up" && <ArrowUp className="w-4 h-4 text-red-500" />}
            {trend === "down" && (
              <ArrowDown className="w-4 h-4 text-green-500" />
            )}
            {trend === "stable" && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {trend === "up" && "Preis steigend"}
            {trend === "down" && "Preis fallend"}
            {trend === "stable" && "Preis stabil"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
