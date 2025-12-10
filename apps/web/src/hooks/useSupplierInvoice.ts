import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  SupplierInvoice,
  CreateSupplierInvoiceDto,
} from "../types/supplier-invoice";

export const useSupplierInvoice = () => {
  const queryClient = useQueryClient();

  const useInvoices = (supplierId?: string) => {
    return useQuery({
      queryKey: ["supplier-invoices", supplierId],
      queryFn: async () => {
        const params = supplierId ? { supplierId } : {};
        const { data } = await api.get<SupplierInvoice[]>(
          "/supplier-invoices",
          { params },
        );
        return data;
      },
    });
  };

  const useInvoice = (id: string) => {
    return useQuery({
      queryKey: ["supplier-invoice", id],
      queryFn: async () => {
        const { data } = await api.get<SupplierInvoice>(
          `/supplier-invoices/${id}`,
        );
        return data;
      },
      enabled: !!id,
    });
  };

  const createInvoice = useMutation({
    mutationFn: async (dto: CreateSupplierInvoiceDto) => {
      const { data } = await api.post<SupplierInvoice>(
        "/supplier-invoices",
        dto,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-invoices"] });
    },
  });

  const approveInvoice = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put<SupplierInvoice>(
        `/supplier-invoices/${id}/approve`,
      );
      return data;
    },
    onSuccess: (data: SupplierInvoice) => {
      queryClient.invalidateQueries({ queryKey: ["supplier-invoices"] });
      queryClient.invalidateQueries({
        queryKey: ["supplier-invoice", data._id],
      });
    },
  });

  return {
    useInvoices,
    useInvoice,
    createInvoice,
    approveInvoice,
  };
};
