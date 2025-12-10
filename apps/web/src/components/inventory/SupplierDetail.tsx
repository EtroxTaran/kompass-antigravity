import { useState } from "react";
import { Supplier } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, FileSignature, Plus } from "lucide-react";
import { SupplierContractList } from "./SupplierContractList";
import { SupplierContractForm } from "./SupplierContractForm";
import { useSupplierContract } from "@/hooks/useSupplierContracts";
import { useSupplier } from "@/hooks/useSupplier";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Ban, CheckCircle, Star } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { SupplierRatingForm } from "../supplier/SupplierRatingForm";
import { SupplierRatingHistory } from "../supplier/SupplierRatingHistory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface SupplierDetailProps {
  supplier: Supplier;
}

export function SupplierDetail({ supplier }: SupplierDetailProps) {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { hasRole } = useAuth();
  const { blacklistSupplier, reinstateSupplier, approveSupplier, rejectSupplier } = useSupplier(supplier._id);
  const { createContract } = useSupplierContract();
  const [blacklistReason, setBlacklistReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const isGF = hasRole("GF");

  const handleCreateContract = async (data: Record<string, unknown>) => {
    try {
      await createContract(supplier._id, data);
      setIsCreateDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlacklist = async () => {
    if (blacklistReason.length < 20) return;
    try {
      await blacklistSupplier(blacklistReason);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReinstate = async () => {
    try {
      await reinstateSupplier();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveSupplier();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (rejectReason.length < 5) return;
    try {
      await rejectSupplier(rejectReason);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {supplier.companyName}
        </h2>
        <div className="flex gap-2 items-center">
          {supplier.status === 'Blacklisted' && (
            <Badge variant="destructive" className="flex gap-1">
              <Ban className="h-3 w-3" />
              Inaktiv (Blacklisted)
            </Badge>
          )}
          {supplier.status === 'PendingApproval' && (
            <Badge variant="secondary" className="flex gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
              <AlertCircle className="h-3 w-3" />
              Wartet auf Genehmigung
            </Badge>
          )}
          {supplier.status === 'Rejected' && (
            <Badge variant="destructive" className="flex gap-1">
              <Ban className="h-3 w-3" />
              Abgelehnt
            </Badge>
          )}

          {isGF && supplier.status === 'PendingApproval' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handleApprove}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Genehmigen
              </Button>

              <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Ban className="h-4 w-4 mr-2" />
                    Ablehnen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Lieferant ablehnen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bitte geben Sie einen Grund für die Ablehnung an.
                      Der Lieferant wird über die Ablehnung benachrichtigt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Grund für die Ablehnung..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className={rejectReason.length > 0 && rejectReason.length < 5 ? "border-red-500" : ""}
                    />
                    {rejectReason.length > 0 && rejectReason.length < 5 && (
                      <p className="text-xs text-red-500 mt-1">Mindestens 5 Zeichen erforderlich.</p>
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReject}
                      disabled={rejectReason.length < 5}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Ablehnen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {isGF && supplier.status === 'Blacklisted' && (
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleReinstate}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Reinstate
            </Button>
          )}

          {isGF && supplier.status !== 'Blacklisted' && supplier.status !== 'Rejected' && supplier.status !== 'PendingApproval' && (
            <AlertDialog open={isBlacklistDialogOpen} onOpenChange={setIsBlacklistDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Blacklist
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Lieferant sperren (Blacklist)</AlertDialogTitle>
                  <AlertDialogDescription>
                    Der Lieferant wird für alle neuen Projekte gesperrt.
                    Bitte geben Sie einen Grund an (min. 20 Zeichen).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Grund für die Sperrung..."
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                    className={blacklistReason.length > 0 && blacklistReason.length < 20 ? "border-red-500" : ""}
                  />
                  {blacklistReason.length > 0 && blacklistReason.length < 20 && (
                    <p className="text-xs text-red-500 mt-1">Mindestens 20 Zeichen erforderlich.</p>
                  )}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBlacklist}
                    disabled={blacklistReason.length < 20}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Sperren
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            variant="outline"
            onClick={() => navigate(`/suppliers/${supplier._id}/edit`)}
          >
            Bearbeiten
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kontaktinformationen</CardTitle>
            {supplier.status === 'Blacklisted' && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Grund für Sperrung:
                </p>
                <p className="mt-1">{supplier.blacklistReason}</p>
                <p className="text-xs text-red-600 mt-2">
                  Gesperrt von: {supplier.blacklistedBy || 'Unbekannt'} am {supplier.blacklistedAt ? new Date(supplier.blacklistedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            )}
            {supplier.status === 'Rejected' && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Ablehnungsgrund:
                </p>
                <p className="mt-1">{supplier.rejectionReason}</p>
                <p className="text-xs text-red-600 mt-2">
                  Abgelehnt von: {supplier.rejectedBy || 'Unbekannt'} am {supplier.rejectedAt ? new Date(supplier.rejectedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.email || "—"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone || "—"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.website || "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p>
                  {supplier.billingAddress.street}{" "}
                  {supplier.billingAddress.streetNumber}
                </p>
                <p>
                  {supplier.billingAddress.zipCode}{" "}
                  {supplier.billingAddress.city}
                </p>
                <p>{supplier.billingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Rating */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Leistungsbewertung</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsRatingDialogOpen(true)}>
                <Star className="h-4 w-4 mr-2" />
                Bewerten
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {supplier.rating ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Gesamtbewertung</span>
                  <div className="flex items-center gap-2">
                    <StarRating rating={supplier.rating.overall} readOnly />
                    <span className="text-xl font-bold">{supplier.rating.overall}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Qualität</span>
                    <span>{supplier.rating.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zuverlässigkeit</span>
                    <span>{supplier.rating.reliability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kommunikation</span>
                    <span>{supplier.rating.communication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preis/Leistung</span>
                    <span>{supplier.rating.priceValue}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-right border-t pt-2">
                  Basierend auf {supplier.rating.reviewCount} Bewertungen
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Star className="h-8 w-8 mb-2 opacity-20" />
                <p>Noch keine Bewertungen</p>
              </div>
            )}

            <SupplierRatingForm
              supplierId={supplier._id}
              supplierName={supplier.companyName}
              open={isRatingDialogOpen}
              onOpenChange={setIsRatingDialogOpen}
              onSuccess={() => window.location.reload()}
            />
          </CardContent>
        </Card>

        <SupplierRatingHistory history={supplier.ratingsHistory} />

      </div>

      {/* Contracts Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Verträge
          </h3>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Neuer Vertrag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neuen Vertrag erstellen</DialogTitle>
              </DialogHeader>
              <SupplierContractForm
                supplierId={supplier._id}
                onSubmit={handleCreateContract}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <SupplierContractList supplierId={supplier._id} />
      </div>
    </div>
  );
}
