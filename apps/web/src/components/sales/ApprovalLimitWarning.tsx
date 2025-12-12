import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ContactPerson } from "@kompass/shared";

interface ApprovalLimitWarningProps {
    expectedValue: number;
    approvalLimit: number;
    contactName: string;
    alternativeContacts: ContactPerson[];
    onSelectAlternative: (contactId: string) => void;
}

/**
 * Warning component displayed when opportunity value exceeds contact's approval limit
 */
export function ApprovalLimitWarning({
    expectedValue,
    approvalLimit,
    contactName,
    alternativeContacts,
    onSelectAlternative,
}: ApprovalLimitWarningProps) {
    const formatEur = (value: number) =>
        new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <Alert variant="destructive" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                Genehmigungslimit überschritten
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <p className="mb-2">
                    ⚠️ Auftragswert ({formatEur(expectedValue)}) überschreitet
                    Genehmigungslimit des Ansprechpartners {contactName} (
                    {formatEur(approvalLimit)})
                </p>

                {alternativeContacts.length > 0 && (
                    <div className="mt-3">
                        <p className="text-sm font-medium mb-2">
                            Alternative Ansprechpartner mit höherem Limit:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {alternativeContacts.map((contact) => (
                                <Button
                                    key={contact._id}
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                                    onClick={() => onSelectAlternative(contact._id)}
                                >
                                    {contact.firstName} {contact.lastName}
                                    {contact.approvalLimitEur && (
                                        <span className="ml-1 text-xs opacity-75">
                                            (bis {formatEur(contact.approvalLimitEur)})
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <p className="mt-3 text-xs opacity-75">
                    Diese Warnung blockiert die Erstellung nicht. Das Flag "Requires Higher
                    Approval" wird automatisch gesetzt.
                </p>
            </AlertDescription>
        </Alert>
    );
}
