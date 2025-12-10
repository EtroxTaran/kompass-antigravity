import { useSuppliers } from "@/hooks/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Ban } from "lucide-react";

export function SupplierList() {
  const { suppliers, loading } = useSuppliers();
  const navigate = useNavigate();

  if (loading) return <div>Loading Suppliers...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <Button onClick={() => navigate("/suppliers/new")}>Add Supplier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <Card
            key={supplier._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/suppliers/${supplier._id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {supplier.companyName}
                </CardTitle>
                {supplier.status === 'PendingApproval' && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
                {supplier.status === 'Blacklisted' && (
                  <Badge variant="destructive">
                    <Ban className="h-3 w-3 mr-1" />
                    Blacklist
                  </Badge>
                )}
                {supplier.status === 'Rejected' && (
                  <Badge variant="destructive">
                    <Ban className="h-3 w-3 mr-1" />
                    Rejected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate">
                {supplier.billingAddress.city},{" "}
                {supplier.billingAddress.country}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {supplier.email}
              </p>
            </CardContent>
          </Card>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No suppliers found.
          </div>
        )}
      </div>
    </div>
  );
}
