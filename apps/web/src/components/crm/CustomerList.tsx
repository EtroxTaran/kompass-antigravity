import { useState } from "react";
import { Customer } from "@kompass/shared";
import { CustomerQuickView } from "./CustomerQuickView";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "@/hooks/useCustomers";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export function CustomerList() {
  const { customers, loading } = useCustomers();
  const navigate = useNavigate();
  const [quickViewCustomer, setQuickViewCustomer] = useState<Customer | null>(
    null,
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <PermissionGuard requiredRoles={["ADM", "GF", "INN", "CRM"]}>
          <Button onClick={() => navigate("/customers/new")}>
            Add Customer
          </Button>
        </PermissionGuard>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/customers/${customer._id}`)}
            >
              <TableCell className="font-medium">
                {customer.companyName}
              </TableCell>
              <TableCell>{customer.billingAddress?.city || "-"}</TableCell>
              <TableCell className="capitalize">
                {customer.customerType}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewCustomer(customer);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/customers/${customer._id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center h-24 text-muted-foreground"
              >
                No customers found. Create your first one!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CustomerQuickView
        customer={quickViewCustomer}
        open={!!quickViewCustomer}
        onOpenChange={(open) => !open && setQuickViewCustomer(null)}
      />
    </div>
  );
}
