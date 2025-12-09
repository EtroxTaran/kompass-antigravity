import { useState } from "react";
import {
  Camera,
  X,
  Loader2,
  AlertCircle,
  Check,
  RotateCcw,
} from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { cn } from "@/lib/utils";

interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
}

interface BusinessCardScannerProps {
  onComplete: (data: Record<string, string>) => void;
  onCancel: () => void;
}

// Simple regex-based extraction (in production, use Tesseract.js or cloud OCR)
const extractContactData = (text: string): ExtractedField[] => {
  const fields: ExtractedField[] = [];

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    fields.push({ field: "email", value: emailMatch[0], confidence: 0.95 });
  }

  // Phone
  const phoneMatch = text.match(/(?:\+49|0)\s*[\d\s/-]{8,}/);
  if (phoneMatch) {
    fields.push({
      field: "phone",
      value: phoneMatch[0].replace(/\s+/g, " ").trim(),
      confidence: 0.85,
    });
  }

  // Website
  const webMatch = text.match(/(?:www\.)?[\w-]+\.\w{2,}(?:\/[\w-]*)?/i);
  if (webMatch && !webMatch[0].includes("@")) {
    fields.push({ field: "website", value: webMatch[0], confidence: 0.8 });
  }

  // Name (first line is often the name)
  const lines = text.split("\n").filter((l) => l.trim().length > 2);
  if (lines.length > 0) {
    const nameLine = lines[0].trim();
    if (nameLine.length < 50 && !/[@\d]/.test(nameLine)) {
      fields.push({ field: "name", value: nameLine, confidence: 0.6 });
    }
  }

  // Company (look for GmbH, AG, etc.)
  const companyMatch = text.match(/[\w\s]+(?:GmbH|AG|KG|e\.K\.|Ltd|Inc)/i);
  if (companyMatch) {
    fields.push({
      field: "company",
      value: companyMatch[0].trim(),
      confidence: 0.75,
    });
  }

  return fields;
};

export function BusinessCardScanner({
  onComplete,
  onCancel,
}: BusinessCardScannerProps) {
  const {
    videoRef,
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
    captureImage,
  } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const handleCapture = async () => {
    const image = captureImage();
    if (image) {
      setCapturedImage(image);
      setIsProcessing(true);

      // Simulate OCR processing (in production, use Tesseract.js)
      setTimeout(() => {
        // Mock OCR result for demo
        const mockText = `Max Mustermann
Geschäftsführer
Beispiel GmbH
max@beispiel.de
+49 123 456789
www.beispiel.de`;

        const fields = extractContactData(mockText);
        setExtractedFields(fields);

        const values: Record<string, string> = {};
        fields.forEach((f) => {
          values[f.field] = f.value;
        });
        setEditedValues(values);

        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedFields([]);
    setEditedValues({});
  };

  const handleComplete = () => {
    stopCamera();
    onComplete(editedValues);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "text-green-600 bg-green-100";
    if (confidence >= 0.7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const fieldLabels: Record<string, string> = {
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    company: "Firma",
    website: "Website",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="font-semibold">Visitenkarte scannen</h2>
        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Camera View / Captured Image / Results */}
      <div className="flex-1 relative">
        {!isActive && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            {error ? (
              <>
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-center mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-primary rounded-lg flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Erneut versuchen
                </button>
              </>
            ) : (
              <>
                <Camera className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-center text-gray-400 mb-4">
                  Scannen Sie eine Visitenkarte, um Kontaktdaten automatisch zu
                  extrahieren.
                </p>
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  Kamera starten
                </button>
              </>
            )}
          </div>
        )}

        {/* Live camera feed */}
        {isActive && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Card frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-48 border-2 border-white rounded-lg shadow-lg">
                <div className="absolute -top-6 left-0 right-0 text-center text-white text-sm">
                  Visitenkarte im Rahmen positionieren
                </div>
              </div>
            </div>
          </>
        )}

        {/* Captured image with results */}
        {capturedImage && (
          <div className="absolute inset-0 flex flex-col">
            {isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p>Text wird erkannt...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg mb-4 max-h-40 object-contain"
                />

                {extractedFields.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Erkannte Daten</h3>
                    {extractedFields.map((field) => (
                      <div
                        key={field.field}
                        className="bg-white rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-100">
                          <span className="text-sm font-medium">
                            {fieldLabels[field.field] || field.field}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded",
                              getConfidenceColor(field.confidence),
                            )}
                          >
                            {Math.round(field.confidence * 100)}%
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editedValues[field.field] || ""}
                          onChange={(e) =>
                            handleFieldChange(field.field, e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Keine Daten erkannt. Bitte erneut versuchen.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-black/50">
        {isActive && !capturedImage && (
          <button
            onClick={handleCapture}
            className="w-full py-3 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Aufnehmen
          </button>
        )}

        {capturedImage && !isProcessing && (
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 border border-white text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Neu aufnehmen
            </button>
            <button
              onClick={handleComplete}
              disabled={extractedFields.length === 0}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Übernehmen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessCardScanner;
