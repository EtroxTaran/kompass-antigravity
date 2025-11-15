/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Save } from 'lucide-react';
import { useState } from 'react';

import type {
  CreateProjectCostDto,
  ProjectCostType,
  ProjectCostStatus,
} from '@kompass/shared/types/entities/project-cost';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { projectCostApi } from '../services/project-cost-api';

import { useToast } from '@/hooks/use-toast';

/**
 * Project Cost Form Component
 *
 * Form for creating/editing project costs.
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */
interface ProjectCostFormProps {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectCostForm({
  projectId,
  onSuccess,
  onCancel,
}: ProjectCostFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // Form state
  const [costType, setCostType] = useState<ProjectCostType>('material');
  const [description, setDescription] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitPrice, setUnitPrice] = useState<string>('0');
  const [taxRate, setTaxRate] = useState<string>('19');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [status, setStatus] = useState<ProjectCostStatus>('planned');

  /**
   * Calculate totals
   */
  const quantityNum = parseFloat(quantity) || 0;
  const unitPriceNum = parseFloat(unitPrice) || 0;
  const taxRateNum = parseFloat(taxRate) / 100 || 0;
  const totalCost = quantityNum * unitPriceNum;
  const taxAmount = totalCost * taxRateNum;
  const totalWithTax = totalCost + taxAmount;

  /**
   * Handle submit
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description || description.length < 10) {
      toast({
        title: 'Fehler',
        description: 'Beschreibung muss mindestens 10 Zeichen lang sein',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const dto: CreateProjectCostDto = {
        projectId,
        costType,
        description,
        supplierName: supplierName || undefined,
        quantity: quantityNum,
        unitPriceEur: unitPriceNum,
        taxRate: taxRateNum,
        invoiceNumber: invoiceNumber || undefined,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : undefined,
        orderNumber: orderNumber || undefined,
        status,
      };

      await projectCostApi.create(dto);

      toast({
        title: 'Gespeichert',
        description: 'Projektkosten wurden erfolgreich gespeichert',
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Projektkosten konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cost Type */}
      <div className="space-y-2">
        <Label htmlFor="cost-type">Kostenart *</Label>
        <Select
          value={costType}
          onValueChange={(v) => setCostType(v as ProjectCostType)}
        >
          <SelectTrigger id="cost-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="contractor">Auftragnehmer</SelectItem>
            <SelectItem value="external_service">
              Externe Dienstleistung
            </SelectItem>
            <SelectItem value="equipment">Ausrüstung</SelectItem>
            <SelectItem value="other">Sonstiges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung *</Label>
        <Textarea
          id="description"
          placeholder="Was wurde gekauft/beauftragt...? (mind. 10 Zeichen)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/500 Zeichen
        </p>
      </div>

      {/* Supplier */}
      <div className="space-y-2">
        <Label htmlFor="supplier">Lieferant / Auftragnehmer</Label>
        <Input
          id="supplier"
          placeholder="Firmenname"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Quantity and Unit Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Menge *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit-price">Einheitspreis (€) *</Label>
          <Input
            id="unit-price"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Tax Rate */}
      <div className="space-y-2">
        <Label htmlFor="tax-rate">MwSt-Satz (%)</Label>
        <Input
          id="tax-rate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        />
      </div>

      {/* Cost Summary */}
      <div className="p-4 bg-muted rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Gesamt (netto):</span>
          <span className="font-mono font-medium">€{totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>MwSt ({taxRate}%):</span>
          <span className="font-mono">€{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Gesamt (brutto):</span>
          <span className="font-mono">€{totalWithTax.toFixed(2)}</span>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice-number">Rechnungsnummer</Label>
          <Input
            id="invoice-number"
            placeholder="RE-2024-001"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Rechnungsdatum</Label>
          <Input
            id="invoice-date"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* Order Number */}
      <div className="space-y-2">
        <Label htmlFor="order-number">Bestellnummer</Label>
        <Input
          id="order-number"
          placeholder="PO-2024-001"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as ProjectCostStatus)}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Geplant</SelectItem>
            <SelectItem value="ordered">Bestellt</SelectItem>
            <SelectItem value="received">Erhalten</SelectItem>
            <SelectItem value="invoiced">Rechnung erhalten</SelectItem>
            <SelectItem value="paid">Bezahlt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          Speichern
        </Button>
      </div>
    </form>
  );
}
