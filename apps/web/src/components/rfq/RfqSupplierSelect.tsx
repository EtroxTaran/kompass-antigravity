import { useState } from "react";
import { useSuppliers } from "@/hooks/useSupplier";
import { Supplier } from "@kompass/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RfqSupplierSelectProps {
  selectedSuppliers: string[];
  onSelectionChange: (suppliers: string[]) => void;
  maxSelection?: number;
  minSelection?: number;
}

export function RfqSupplierSelect({
  selectedSuppliers,
  onSelectionChange,
  maxSelection = 5,
  minSelection = 1,
}: RfqSupplierSelectProps) {
  const { suppliers, loading } = useSuppliers();
  const [search, setSearch] = useState("");

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(search.toLowerCase());
    // Only show approved/active suppliers (not blacklisted or pending/rejected)
    const isAvailable = supplier.status === "Active" || !supplier.status;
    return matchesSearch && isAvailable;
  });

  const handleToggle = (supplierId: string) => {
    if (selectedSuppliers.includes(supplierId)) {
      onSelectionChange(selectedSuppliers.filter((id) => id !== supplierId));
    } else {
      if (selectedSuppliers.length < maxSelection) {
        onSelectionChange([...selectedSuppliers, supplierId]);
      }
    }
  };

  const isValid =
    selectedSuppliers.length >= minSelection &&
    selectedSuppliers.length <= maxSelection;

  if (loading) {
    return <div className="text-center p-4">Loading suppliers...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Select Suppliers to Invite</CardTitle>
        <CardDescription>
          Select {minSelection}-{maxSelection} suppliers to send this RFQ.{" "}
          <Badge variant={isValid ? "default" : "destructive"}>
            {selectedSuppliers.length} selected
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[200px] rounded-md border p-4">
          {filteredSuppliers.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No suppliers found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSuppliers.map((supplier: Supplier) => (
                <div key={supplier._id} className="flex items-center space-x-3">
                  <Checkbox
                    id={supplier._id}
                    checked={selectedSuppliers.includes(supplier._id)}
                    onCheckedChange={() => handleToggle(supplier._id)}
                    disabled={
                      !selectedSuppliers.includes(supplier._id) &&
                      selectedSuppliers.length >= maxSelection
                    }
                  />
                  <Label
                    htmlFor={supplier._id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{supplier.companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {supplier.email || "No email"}
                      {supplier.category && supplier.category.length > 0 && (
                        <span className="ml-2">
                          ({supplier.category.join(", ")})
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
