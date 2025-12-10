import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PortalLogin } from "@/components/portal/PortalLogin";
import { PortalVerify } from "@/components/portal/PortalVerify";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { PortalProjectDetail } from "@/components/portal/PortalProjectDetail";
import { CustomerList } from "@/components/crm/CustomerList";
import { OpportunityBoard } from "@/components/sales/OpportunityBoard";
import { ProjectList } from "@/components/pm/ProjectList";
import { SupplierList } from "@/components/inventory/SupplierList";
import { MaterialList } from "@/components/inventory/MaterialList";
import { MainLayout } from "@/components/layout/MainLayout";

import { CustomerForm } from "@/components/crm/CustomerForm";
import { CustomerDetail } from "@/components/crm/CustomerDetail";

import { RfqList } from "@/components/rfq/RfqList";
import { RfqForm } from "@/components/rfq/RfqForm";
import { RfqDetail } from "@/components/rfq/RfqDetail";

function RfqListPage() {
  return (
    <MainLayout
      userRole="PM" // Assuming PM handles RFQs mostly
      breadcrumbs={[{ label: "Purchasing", href: "/rfqs" }, { label: "RFQs" }]}
    >
      <RfqList />
    </MainLayout>
  );
}

function RfqCreatePage() {
  return (
    <MainLayout
      userRole="PM"
      breadcrumbs={[{ label: "Purchasing", href: "/rfqs" }, { label: "RFQs", href: "/rfqs" }, { label: "New" }]}
    >
      <RfqForm />
    </MainLayout>
  );
}

function RfqDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <MainLayout
      userRole="PM"
      breadcrumbs={[{ label: "Purchasing", href: "/rfqs" }, { label: "RFQs", href: "/rfqs" }, { label: id || 'Detail' }]}
    >
      <RfqDetail />
    </MainLayout>
  );
}
import { ContactDetail } from "@/components/crm/ContactDetail";
import { ProtocolList } from "@/components/crm/ProtocolList";
import { ProtocolForm } from "@/components/crm/ProtocolForm";
import { ProjectCostList } from "@/components/accounting/ProjectCostList";
import { ProjectCostForm } from "@/components/accounting/ProjectCostForm";
import { PurchaseOrderList } from "@/components/inventory/PurchaseOrderList";
import { PurchaseOrderForm } from "@/components/inventory/PurchaseOrderForm";
import { PurchaseOrderDetail } from "@/components/inventory/PurchaseOrderDetail";
import { useCustomer } from "@/hooks/useCustomer";
import { useParams, useNavigate } from "react-router-dom";

import { OpportunityForm } from "@/components/sales/OpportunityForm";
import { OpportunityDetail } from "@/components/sales/OpportunityDetail";
import { useOpportunity } from "@/hooks/useOpportunity";

import { ProjectForm } from "@/components/pm/ProjectForm";
import { ProjectDetail } from "@/components/pm/ProjectDetail";
import { ProjectTaskForm } from "@/components/pm/ProjectTaskForm";
import { TimeEntryForm } from "@/components/pm/TimeEntryForm";
import { useProject } from "@/hooks/useProject";

import { SupplierForm } from "@/components/inventory/SupplierForm";
import { SupplierDetail } from "@/components/inventory/SupplierDetail";
import { useSupplier } from "@/hooks/useSupplier";

import { MaterialForm } from "@/components/inventory/MaterialForm";
import { MaterialDetail } from "@/components/inventory/MaterialDetail";
import { useMaterial } from "@/hooks/useMaterial";

import { InvoiceList } from "@/components/accounting/InvoiceList";
import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { InvoiceDetail } from "@/components/accounting/InvoiceDetail";

import { PresenceProvider } from "@/contexts/PresenceContext";

import { LocationList } from "@/components/shared/LocationList";
import { LocationForm } from "@/components/shared/LocationForm";

// Tasks
import { OfferList } from "@/components/sales/OfferList";
import { OfferForm } from "@/components/sales/OfferForm";
import { OfferDetail } from "@/components/sales/OfferDetail";
import { useOffer } from "@/hooks/useOffers";

import { ContractList } from "@/components/sales/ContractList";
import { ContractForm } from "@/components/sales/ContractForm";
import { ContractDetail } from "@/components/sales/ContractDetail";
import { useContract } from "@/hooks/useContracts";

import { ExpenseList } from "@/components/accounting/ExpenseList";
import { ExpenseForm } from "@/components/accounting/ExpenseForm";
import { MileageList } from "@/components/accounting/MileageList";
import { MileageForm } from "@/components/accounting/MileageForm";

import { TourList } from "@/components/inventory/TourList";
import { TourDetail } from "@/components/inventory/TourDetail";
import { TourForm } from "@/components/inventory/TourForm";

import { UserTaskDashboard } from "@/components/tasks/UserTaskDashboard";
import { GFDashboard } from "@/components/dashboards/GFDashboard";
import { ADMDashboard } from "@/components/dashboards/ADMDashboard";
import { PLANDashboard } from "@/components/dashboards/PLANDashboard";
import { WarehouseDashboard } from "@/components/dashboards/WarehouseDashboard";
import { KALKDashboard } from "@/components/dashboards/KALKDashboard";
import { BUCHDashboard } from "@/components/dashboards/BUCHDashboard";
import { INNDashboard } from "@/components/dashboards/INNDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/calendar";
import { MyTimesheetsPage } from "@/pages/MyTimesheetsPage";

// --- INVENTORY WRAPPERS ---

function SupplierCreatePage() {
  const { saveSupplier } = useSupplier();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveSupplier(data);
    navigate("/suppliers");
  };

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Lieferanten", href: "/suppliers" },
        { label: "Neu" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Supplier</h1>
        <SupplierForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { supplier, loading } = useSupplier(id);

  const content =
    loading || !supplier ? (
      <div>Loading...</div>
    ) : (
      <SupplierDetail supplier={supplier} />
    );

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Lieferanten", href: "/suppliers" },
        { label: supplier?.companyName || "Details" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

function SupplierEditPage() {
  const { id } = useParams<{ id: string }>();
  const { supplier, loading, saveSupplier } = useSupplier(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveSupplier(data);
    navigate(`/suppliers/${id}`);
  };

  const content =
    loading || !supplier ? (
      <div>Loading...</div>
    ) : (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Supplier</h1>
        <SupplierForm defaultValues={supplier} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Lieferanten", href: "/suppliers" },
        { label: "Bearbeiten" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

function MaterialCreatePage() {
  const { saveMaterial } = useMaterial();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveMaterial(data);
    navigate("/materials");
  };

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Materialien", href: "/materials" },
        { label: "Neu" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Material</h1>
        <MaterialForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { material, loading } = useMaterial(id);

  const content =
    loading || !material ? (
      <div>Loading...</div>
    ) : (
      <MaterialDetail material={material} />
    );

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Materialien", href: "/materials" },
        { label: material?.name || "Details" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

function MaterialEditPage() {
  const { id } = useParams<{ id: string }>();
  const { material, loading, saveMaterial } = useMaterial(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveMaterial(data);
    navigate(`/materials/${id}`);
  };

  const content =
    loading || !material ? (
      <div>Loading...</div>
    ) : (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Material</h1>
        <MaterialForm defaultValues={material} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <MainLayout
      userRole="ADM"
      breadcrumbs={[
        { label: "Materialien", href: "/materials" },
        { label: "Bearbeiten" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

// --- PROJECT WRAPPERS ---

function ProjectCreatePage() {
  const { saveProject } = useProject();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveProject(data);
    navigate("/projects");
  };

  return (
    <MainLayout
      userRole="PM"
      breadcrumbs={[{ label: "Projekte", href: "/projects" }, { label: "Neu" }]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Project</h1>
        <ProjectForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(id);

  let content;
  if (loading) content = <div>Loading...</div>;
  else if (error || !project) content = <div>Error loading project</div>;
  else content = <ProjectDetail project={project} />;

  return (
    <MainLayout
      userRole="PM"
      breadcrumbs={[
        { label: "Projekte", href: "/projects" },
        { label: project?.name || "Details" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, saveProject } = useProject(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveProject(data);
    navigate(`/projects/${id}`);
  };

  let content;
  if (loading) content = <div>Loading...</div>;
  else if (!project) content = <div>Not found</div>;
  else
    content = (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <ProjectForm defaultValues={project} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <MainLayout
      userRole="PM"
      breadcrumbs={[
        { label: "Projekte", href: "/projects" },
        { label: "Bearbeiten" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

// --- SALES WRAPPERS ---

function OpportunityCreatePage() {
  const { saveOpportunity } = useOpportunity();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveOpportunity(data);
    navigate("/sales");
  };

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[{ label: "Sales", href: "/sales" }, { label: "Neu" }]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Opportunity</h1>
        <OpportunityForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { opportunity, loading, error } = useOpportunity(id);

  let content;
  if (loading) content = <div>Loading...</div>;
  else if (error || !opportunity)
    content = <div>Error loading opportunity</div>;
  else content = <OpportunityDetail opportunity={opportunity} />;

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: opportunity?.title || "Details" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

function OpportunityEditPage() {
  const { id } = useParams<{ id: string }>();
  const { opportunity, loading, saveOpportunity } = useOpportunity(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveOpportunity(data);
    navigate(`/sales/${id}`);
  };

  let content;
  if (loading) content = <div>Loading...</div>;
  else if (!opportunity) content = <div>Not found</div>;
  else
    content = (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Opportunity</h1>
        <OpportunityForm defaultValues={opportunity} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Bearbeiten" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

// --- OFFER WRAPPERS ---

function OfferCreatePage() {
  const { saveOffer } = useOffer();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveOffer(data);
    navigate("/sales/offers");
  };

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Offers", href: "/sales/offers" },
        { label: "Neu" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Offer</h1>
        <OfferForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/sales/offers")}
        />
      </div>
    </MainLayout>
  );
}

function OfferDetailPageWrapper() {
  // Renamed to avoid conflict if any, though local scope is fine.
  // OfferDetail component handles fetching internally via hook?
  // Checking OfferDetail.tsx... yes it uses useOffer(id) internally.
  // So here I just render the component inside layout.
  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Offers", href: "/sales/offers" },
        { label: "Details" },
      ]}
    >
      <OfferDetail />
    </MainLayout>
  );
}

function OfferEditPage() {
  const { id } = useParams<{ id: string }>();
  const { offer, loading, saveOffer } = useOffer(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveOffer(data);
    navigate(`/sales/offers/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!offer) return <div>Not found</div>;

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Offers", href: "/sales/offers" },
        { label: "Bearbeiten" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Offer</h1>
        <OfferForm
          defaultValues={offer}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/sales/offers/${id}`)}
        />
      </div>
    </MainLayout>
  );
}

// --- CONTRACT WRAPPERS ---

function ContractCreatePage() {
  const { saveContract } = useContract();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveContract(data);
    navigate("/sales/contracts");
  };

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Contracts", href: "/sales/contracts" },
        { label: "Neu" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Contract</h1>
        <ContractForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/sales/contracts")}
        />
      </div>
    </MainLayout>
  );
}

function ContractDetailPageWrapper() {
  // ContractDetail handles fetching.
  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Contracts", href: "/sales/contracts" },
        { label: "Details" },
      ]}
    >
      <ContractDetail />
    </MainLayout>
  );
}

function ContractEditPage() {
  const { id } = useParams<{ id: string }>();
  const { contract, loading, saveContract } = useContract(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveContract(data);
    navigate(`/sales/contracts/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!contract) return <div>Not found</div>;

  return (
    <MainLayout
      userRole="SALES"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Contracts", href: "/sales/contracts" },
        { label: "Bearbeiten" },
      ]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Contract</h1>
        <ContractForm
          defaultValues={contract}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/sales/contracts/${id}`)}
        />
      </div>
    </MainLayout>
  );
}

// --- CUSTOMER WRAPPERS ---

function CustomerCreatePage() {
  const { saveCustomer } = useCustomer();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveCustomer(data);
    navigate("/customers");
  };

  return (
    <MainLayout
      userRole="CRM"
      breadcrumbs={[{ label: "Kunden", href: "/customers" }, { label: "Neu" }]}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">New Customer</h1>
        <CustomerForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { customer } = useCustomer(id);
  if (!customer) return <div>Loading...</div>;
  return (
    <MainLayout
      userRole="CRM"
      breadcrumbs={[
        { label: "Kunden", href: "/customers" },
        { label: customer.companyName },
      ]}
    >
      <CustomerDetail customer={customer} />
    </MainLayout>
  );
};

const ContactDetailPage = () => {
  return (
    <MainLayout userRole="CRM" breadcrumbs={[{ label: "Contacts", href: "#" }]}>
      <ContactDetail />
    </MainLayout>
  );
};

function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const { customer, loading, saveCustomer } = useCustomer(id);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveCustomer(data);
    navigate(`/customers/${id}`);
  };

  let content;
  if (loading) content = <div>Loading...</div>;
  else if (!customer) content = <div>Not found</div>;
  else
    content = (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Customer</h1>
        <CustomerForm defaultValues={customer} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <MainLayout
      userRole="CRM"
      breadcrumbs={[
        { label: "Kunden", href: "/customers" },
        { label: "Bearbeiten" },
      ]}
    >
      {content}
    </MainLayout>
  );
}

// --- PROTOCOL HELPERS ---
const ProtocolListPage = () => (
  <MainLayout
    userRole="SALES"
    breadcrumbs={[{ label: "Protokolle", href: "/protocols" }]}
  >
    <ProtocolList />
  </MainLayout>
);

const ProtocolCreatePage = () => (
  <MainLayout
    userRole="SALES"
    breadcrumbs={[
      { label: "Protokolle", href: "/protocols" },
      { label: "Neu" },
    ]}
  >
    <ProtocolForm />
  </MainLayout>
);

const ProtocolEditPage = () => (
  <MainLayout
    userRole="SALES"
    breadcrumbs={[
      { label: "Protokolle", href: "/protocols" },
      { label: "Bearbeiten" },
    ]}
  >
    <ProtocolForm />
  </MainLayout>
);

// --- PROJECT COST HELPERS ---
const ProjectCostListPage = () => (
  <MainLayout
    userRole="PM"
    breadcrumbs={[{ label: "Projektkosten", href: "/project-costs" }]}
  >
    <ProjectCostList />
  </MainLayout>
);

const ProjectCostCreatePage = () => (
  <MainLayout
    userRole="PM"
    breadcrumbs={[
      { label: "Projektkosten", href: "/project-costs" },
      { label: "Neu" },
    ]}
  >
    <ProjectCostForm />
  </MainLayout>
);

const ProjectCostEditPage = () => (
  <MainLayout
    userRole="PM"
    breadcrumbs={[
      { label: "Projektkosten", href: "/project-costs" },
      { label: "Bearbeiten" },
    ]}
  >
    <ProjectCostForm />
  </MainLayout>
);

// --- PURCHASE ORDER HELPERS ---
const PurchaseOrderListPage = () => (
  <MainLayout
    userRole="LAGER"
    breadcrumbs={[{ label: "Bestellungen", href: "/purchase-orders" }]}
  >
    <PurchaseOrderList />
  </MainLayout>
);

const PurchaseOrderCreatePage = () => (
  <MainLayout
    userRole="LAGER"
    breadcrumbs={[
      { label: "Bestellungen", href: "/purchase-orders" },
      { label: "Neu" },
    ]}
  >
    <PurchaseOrderForm />
  </MainLayout>
);

const PurchaseOrderEditPage = () => (
  <MainLayout
    userRole="LAGER"
    breadcrumbs={[
      { label: "Bestellungen", href: "/purchase-orders" },
      { label: "Bearbeiten" },
    ]}
  >
    <PurchaseOrderForm />
  </MainLayout>
);
const PurchaseOrderDetailPage = () => (
  <MainLayout
    userRole="LAGER"
    breadcrumbs={[
      { label: "Bestellungen", href: "/purchase-orders" },
      { label: "Details" },
    ]}
  >
    <PurchaseOrderDetail />
  </MainLayout>
);

// --- INVOICE HELPERS ---
const InvoiceListPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Rechnungen", href: "/invoices" }]}
  >
    <InvoiceList />
  </MainLayout>
);

const InvoiceCreatePage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Rechnungen", href: "/invoices" }, { label: "Neu" }]}
  >
    <InvoiceForm />
  </MainLayout>
);

const InvoiceDetailPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[
      { label: "Rechnungen", href: "/invoices" },
      { label: "Details" },
    ]}
  >
    <InvoiceDetail />
  </MainLayout>
);

const InvoiceEditPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[
      { label: "Rechnungen", href: "/invoices" },
      { label: "Bearbeiten" },
    ]}
  >
    <InvoiceForm />
  </MainLayout>
);

// --- WAREHOUSE / LOCATION HELPERS ---
const WarehouseListPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[
      { label: "Lager & Katalog", href: "/inventory" },
      { label: "Lagerorte" },
    ]}
  >
    <LocationList />
  </MainLayout>
);

const WarehouseCreatePage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[
      { label: "Lagerorte", href: "/warehouses" },
      { label: "Neu" },
    ]}
  >
    <LocationForm />
  </MainLayout>
);

const WarehouseEditPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[
      { label: "Lagerorte", href: "/warehouses" },
      { label: "Bearbeiten" },
    ]}
  >
    <LocationForm />
  </MainLayout>
);

const LocationListPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[{ label: "Standorte", href: "/locations" }]}
  >
    <LocationList />
  </MainLayout>
);

const LocationCreatePage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[{ label: "Standorte", href: "/locations" }, { label: "Neu" }]}
  >
    <LocationForm />
  </MainLayout>
);

const LocationEditPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[
      { label: "Standorte", href: "/locations" },
      { label: "Bearbeiten" },
    ]}
  >
    <LocationForm />
  </MainLayout>
);

// --- EXPENSE HELPERS ---
const ExpenseListPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Ausgaben", href: "/expenses" }]}
  >
    <ExpenseList />
  </MainLayout>
);

const ExpenseCreatePage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Ausgaben", href: "/expenses" }, { label: "Neu" }]}
  >
    <ExpenseForm />
  </MainLayout>
);

const ExpenseEditPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[
      { label: "Ausgaben", href: "/expenses" },
      { label: "Bearbeiten" },
    ]}
  >
    <ExpenseForm />
  </MainLayout>
);

// --- MILEAGE HELPERS ---
const MileageListPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Fahrtenbuch", href: "/mileage" }]}
  >
    <MileageList />
  </MainLayout>
);

const MileageCreatePage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[{ label: "Fahrtenbuch", href: "/mileage" }, { label: "Neu" }]}
  >
    <MileageForm />
  </MainLayout>
);

const MileageEditPage = () => (
  <MainLayout
    userRole="BUCH"
    breadcrumbs={[
      { label: "Fahrtenbuch", href: "/mileage" },
      { label: "Bearbeiten" },
    ]}
  >
    <MileageForm />
  </MainLayout>
);

// --- TOUR HELPERS ---
const TourListPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[{ label: "Touren", href: "/tours" }]}
  >
    <TourList />
  </MainLayout>
);

const TourCreatePage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[{ label: "Touren", href: "/tours" }, { label: "Neu" }]}
  >
    <TourForm />
  </MainLayout>
);

const TourEditPage = () => (
  <MainLayout
    userRole="ADM"
    breadcrumbs={[{ label: "Touren", href: "/tours" }, { label: "Bearbeiten" }]}
  >
    <TourForm />
  </MainLayout>
);

const TourDetailPage = () => (
  <MainLayout
    userRole="LAGER"
    breadcrumbs={[{ label: "Touren", href: "/tours" }, { label: "Details" }]}
  >
    <TourDetail />
  </MainLayout>
);

// --- MAIN APP & DASHBOARD ---

function Dashboard() {
  return (
    <MainLayout userRole="ADM" breadcrumbs={[{ label: "Home", href: "/" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">KOMPASS MVP</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="gf">GF (CEO)</TabsTrigger>
            <TabsTrigger value="adm">Sales (ADM)</TabsTrigger>
            <TabsTrigger value="inn">Inside Sales (INN)</TabsTrigger>
            <TabsTrigger value="plan">Projects (PLAN)</TabsTrigger>
            <TabsTrigger value="kalk">Kalkulation (KALK)</TabsTrigger>
            <TabsTrigger value="lag">Lager (LAG)</TabsTrigger>
            <TabsTrigger value="buch">Buchhaltung (BUCH)</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-12">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                  Sales & Projects
                </h2>
                <div className="space-y-8">
                  <OpportunityBoard />
                  <ProjectList />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                  Master Data
                </h2>
                <div className="grid grid-cols-1 gap-8">
                  <CustomerList />
                  <SupplierList />
                  <MaterialList />
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="gf" className="space-y-4">
            <GFDashboard />
          </TabsContent>

          <TabsContent value="adm" className="space-y-4">
            <ADMDashboard />
          </TabsContent>

          <TabsContent value="inn" className="space-y-4">
            <INNDashboard />
          </TabsContent>

          <TabsContent value="plan" className="space-y-4">
            <PLANDashboard />
          </TabsContent>

          <TabsContent value="kalk" className="space-y-4">
            <KALKDashboard />
          </TabsContent>

          <TabsContent value="lag" className="space-y-4">
            <WarehouseDashboard />
          </TabsContent>

          <TabsContent value="buch" className="space-y-4">
            <BUCHDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <PresenceProvider>
        <Routes>
          {/* Portal Routes */}
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/auth/verify" element={<PortalVerify />} />
          <Route path="/portal/projects" element={<PortalDashboard />} />
          <Route path="/portal/projects/:id" element={<PortalProjectDetail />} />
          <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
          <Route path="/" element={<Dashboard />} />

          {/* Sales Routes */}
          <Route
            path="/sales"
            element={
              <MainLayout
                userRole="SALES"
                breadcrumbs={[{ label: "Sales", href: "/sales" }]}
              >
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Sales Pipeline</h1>
                  <OpportunityBoard />
                </div>
              </MainLayout>
            }
          />
          <Route path="/sales/new" element={<OpportunityCreatePage />} />
          <Route path="/sales/:id" element={<OpportunityDetailPage />} />
          <Route path="/sales/:id/edit" element={<OpportunityEditPage />} />

          {/* Offers Routes */}
          <Route
            path="/sales/offers"
            element={
              <MainLayout
                userRole="SALES"
                breadcrumbs={[
                  { label: "Sales", href: "/sales" },
                  { label: "Offers" },
                ]}
              >
                <OfferList />
              </MainLayout>
            }
          />
          <Route path="/sales/offers/new" element={<OfferCreatePage />} />
          <Route path="/sales/offers/:id" element={<OfferDetailPageWrapper />} />
          <Route path="/sales/offers/:id/edit" element={<OfferEditPage />} />

          {/* Contracts Routes */}
          <Route
            path="/sales/contracts"
            element={
              <MainLayout
                userRole="SALES"
                breadcrumbs={[
                  { label: "Sales", href: "/sales" },
                  { label: "Contracts" },
                ]}
              >
                <ContractList />
              </MainLayout>
            }
          />
          <Route path="/sales/contracts/new" element={<ContractCreatePage />} />
          <Route
            path="/sales/contracts/:id"
            element={<ContractDetailPageWrapper />}
          />
          <Route
            path="/sales/contracts/:id/edit"
            element={<ContractEditPage />}
          />

          {/* Projects Routes */}
          <Route
            path="/projects"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[{ label: "Projekte", href: "/projects" }]}
              >
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Projects</h1>
                  <ProjectList />
                </div>
              </MainLayout>
            }
          />
          <Route path="/projects/new" element={<ProjectCreatePage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/edit" element={<ProjectEditPage />} />

          {/* Project Task Routes */}
          <Route
            path="/projects/:projectId/tasks/new"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[
                  { label: "Projekte", href: "/projects" },
                  { label: "Task" },
                ]}
              >
                <ProjectTaskForm />
              </MainLayout>
            }
          />
          <Route
            path="/projects/:projectId/tasks/:taskId/edit"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[
                  { label: "Projekte", href: "/projects" },
                  { label: "Task" },
                ]}
              >
                <ProjectTaskForm />
              </MainLayout>
            }
          />

          {/* Time Entry Routes */}
          <Route
            path="/time-entries/new"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[
                  { label: "Time", href: "/projects" },
                  { label: "Log Time" },
                ]}
              >
                <TimeEntryForm />
              </MainLayout>
            }
          />
          <Route
            path="/time-entries/:id/edit"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[
                  { label: "Time", href: "/projects" },
                  { label: "Edit Time" },
                ]}
              >
                <TimeEntryForm />
              </MainLayout>
            }
          />

          {/* Project Cost Routes */}
          <Route path="/project-costs" element={<ProjectCostListPage />} />
          <Route path="/project-costs/new" element={<ProjectCostCreatePage />} />
          <Route path="/project-costs/:id/edit" element={<ProjectCostEditPage />} />

          {/* Customer Routes */}
          <Route
            path="/customers"
            element={
              <MainLayout
                userRole="CRM"
                breadcrumbs={[{ label: "Kunden", href: "/customers" }]}
              >
                <div className="space-y-4">
                  <CustomerList />
                </div>
              </MainLayout>
            }
          />
          <Route path="/customers/new" element={<CustomerCreatePage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/protocols" element={<ProtocolListPage />} />
          <Route path="/protocols/new" element={<ProtocolCreatePage />} />
          <Route path="/protocols/:id/edit" element={<ProtocolEditPage />} />

          {/* Inventory */}
          <Route
            path="/suppliers"
            element={
              <MainLayout
                userRole="ADM"
                breadcrumbs={[{ label: "Lieferanten", href: "/suppliers" }]}
              >
                <div className="space-y-4">
                  <SupplierList />
                </div>
              </MainLayout>
            }
          />
          <Route path="/suppliers/new" element={<SupplierCreatePage />} />
          <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
          <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />

          <Route
            path="/materials"
            element={
              <MainLayout
                userRole="ADM"
                breadcrumbs={[{ label: "Materialien", href: "/materials" }]}
              >
                <div className="space-y-4">
                  <MaterialList />
                </div>
              </MainLayout>
            }
          />
          <Route path="/materials/new" element={<MaterialCreatePage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />
          <Route path="/materials/:id/edit" element={<MaterialEditPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrderListPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderCreatePage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
          <Route path="/purchase-orders/:id/edit" element={<PurchaseOrderEditPage />} />
          <Route path="/tours" element={<TourListPage />} />
          <Route path="/tours/new" element={<TourCreatePage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
          <Route path="/tours/:id/edit" element={<TourEditPage />} />

          <Route path="/rfqs" element={<RfqListPage />} />
          <Route path="/rfqs/new" element={<RfqCreatePage />} />
          <Route path="/rfqs/:id" element={<RfqDetailPage />} />

          {/* Accounting */}
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/new" element={<InvoiceCreatePage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEditPage />} />
          <Route path="/expenses" element={<ExpenseListPage />} />
          <Route path="/expenses/new" element={<ExpenseCreatePage />} />
          <Route path="/expenses/:id/edit" element={<ExpenseEditPage />} />
          <Route path="/mileage" element={<MileageListPage />} />
          <Route path="/mileage/new" element={<MileageCreatePage />} />
          <Route path="/mileage/:id/edit" element={<MileageEditPage />} />

          {/* Shared */}
          <Route path="/locations" element={<LocationListPage />} />
          <Route path="/locations/new" element={<LocationCreatePage />} />
          <Route path="/locations/:id" element={<LocationEditPage />} />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={
              <MainLayout
                userRole="ADM"
                breadcrumbs={[{ label: "Meine Aufgaben", href: "/tasks" }]}
              >
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Meine Aufgaben</h1>
                  <UserTaskDashboard />
                </div>
              </MainLayout>
            }
          />

          {/* Dashboards */}
          <Route path="/dashboard/gf" element={<GFDashboard />} />
          <Route path="/dashboard/adm" element={<ADMDashboard />} />
          <Route path="/dashboard/plan" element={<PLANDashboard />} />
          <Route path="/dashboard/warehouse" element={<WarehouseDashboard />} />
          <Route path="/dashboard/kalk" element={<KALKDashboard />} />
          <Route path="/dashboard/buch" element={<BUCHDashboard />} />
          <Route path="/dashboard/inn" element={<INNDashboard />} />

          {/* Warehouse Management */}
          <Route path="/warehouse" element={<WarehouseListPage />} />
          <Route path="/warehouse/new" element={<WarehouseCreatePage />} />
          <Route path="/warehouse/:id/edit" element={<WarehouseEditPage />} />

          {/* My Timesheets Route */}
          <Route
            path="/timesheets/my"
            element={
              <MainLayout
                userRole="PM"
                breadcrumbs={[{ label: "Meine Zeiterfassung", href: "/timesheets/my" }]}
              >
                <MyTimesheetsPage />
              </MainLayout>
            }
          />

          {/* Calendar Route */}
          <Route
            path="/calendar"
            element={
              <MainLayout
                userRole="ADM"
                breadcrumbs={[{ label: "Kalender", href: "/calendar" }]}
              >
                <CalendarView />
              </MainLayout>
            }
          />

          {/* Auth callback for Keycloak OIDC */}
          <Route
            path="/auth/callback"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Authentifizierung wird verarbeitet...
                  </p>
                </div>
              </div>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PresenceProvider>
    </Router>
  );
}

export default App;
