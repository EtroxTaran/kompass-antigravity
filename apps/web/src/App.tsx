import { CustomerList } from '@/components/crm/CustomerList';
import './App.css';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">KOMPASS</h1>
      <CustomerList />
    </div>
  );
}

export default App;
