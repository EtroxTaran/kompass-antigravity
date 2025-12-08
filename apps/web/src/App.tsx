import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerList } from '@/components/crm/CustomerList';
import { OpportunityBoard } from '@/components/sales/OpportunityBoard';
import { ProjectList } from '@/components/pm/ProjectList';
import { SupplierList } from '@/components/inventory/SupplierList';
import { MaterialList } from '@/components/inventory/MaterialList';
import { MainLayout } from '@/components/layout/MainLayout';

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">KOMPASS MVP</h1>
      <div className="grid grid-cols-1 gap-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Sales & Projects</h2>
          <div className="space-y-8">
            <OpportunityBoard />
            <ProjectList />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Master Data</h2>
          <div className="grid grid-cols-1 gap-8">
            <CustomerList />
            <SupplierList />
            <MaterialList />
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout userRole="ADM" breadcrumbs={[{ label: 'Home', href: '/' }]}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Sales Pipeline</h1><OpportunityBoard /></div>} />
          <Route path="/projects" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Projects</h1><ProjectList /></div>} />
          <Route path="/customers" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Customers</h1><CustomerList /></div>} />
          <Route path="/inventory/material" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Materials</h1><MaterialList /></div>} />
          <Route path="/inventory/suppliers" element={<div className="space-y-4"><h1 className="text-2xl font-bold">Suppliers</h1><SupplierList /></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
