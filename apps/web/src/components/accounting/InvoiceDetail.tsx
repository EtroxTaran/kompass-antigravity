import { useParams, useNavigate } from "react-router-dom";
import { useInvoice } from "@/hooks/useInvoice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Printer, Send } from "lucide-react";
import { format } from "date-fns";
import { useCustomer } from "@/hooks/useCustomer";
import { CommentSection } from "@/components/common/comments/CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoice, loading } = useInvoice(id);
  const { customer } = useCustomer(invoice?.customerId);
  const queryClient = useQueryClient();

  if (loading || !invoice) return <div>Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "sent":
        return "bg-blue-500";
      case "overdue":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-yellow-500"; // Draft
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          {invoice.status === "draft" && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" /> Send Invoice
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="invoice" className="space-y-4">
        <TabsList className="no-print">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <Card className="p-8 bg-white shadow-lg print:shadow-none">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-500">#{invoice.invoiceNumber}</p>
                <div className="mt-4">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">KOMPASS inc.</h3>
                <p className="text-sm text-gray-600">Sample St. 123</p>
                <p className="text-sm text-gray-600">12345 Berlin</p>
                <p className="text-sm text-gray-600">Germany</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Bill To
                </h4>
                {customer ? (
                  <div className="text-sm">
                    <p className="font-bold">{customer.companyName}</p>
                    <p>
                      {customer.billingAddress?.street}{" "}
                      {customer.billingAddress?.streetNumber}
                    </p>
                    <p>
                      {customer.billingAddress?.zipCode}{" "}
                      {customer.billingAddress?.city}
                    </p>
                    <p>{customer.billingAddress?.country}</p>
                    <p className="mt-2 text-gray-500">{customer.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-400">Customer not found</p>
                )}
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">
                      {format(new Date(invoice.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium">
                      {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  {invoice.projectId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project Ref:</span>
                      <span className="font-medium">...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Qty</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.positions.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {item.unitPrice.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-medium">
                        {(item.quantity * item.unitPrice).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-12">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Subtotal</span>
                  <span className="font-medium">
                    {invoice.totalNet.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">VAT (19%)</span>
                  <span className="font-medium">
                    {invoice.vatAmount.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-blue-600">
                    {invoice.totalGross.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center border-t pt-8">
              <p>Thank you for your business. Please pay within 14 days.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="h-[600px]">
          <CommentSection
            entityType="invoice"
            entityId={invoice._id}
            comments={invoice.comments || []}
            onCommentAdded={() => {
              queryClient.invalidateQueries({ queryKey: ['invoices', id] });
            }}
            onCommentResolved={() => {
              queryClient.invalidateQueries({ queryKey: ['invoices', id] });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
