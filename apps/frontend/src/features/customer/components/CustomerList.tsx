import { useCustomerList } from '../hooks/useCustomer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useCustomerStore } from '../store/customerStore';

/**
 * CustomerList Component
 * 
 * Displays list of customers with:
 * - Search functionality
 * - Filtering
 * - Offline support
 * - Loading states
 * 
 * Uses shadcn/ui components exclusively
 */
export function CustomerList(): JSX.Element {
  const { data: customers, isLoading, error } = useCustomerList();
  const { searchTerm, setSearchTerm } = useCustomerStore();

  // Filter customers by search term
  const filteredCustomers = customers?.filter((customer) =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading customers: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          type="search"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
          aria-label="Search customers"
        />
        <Button
          onClick={() => {
            /* Navigate to create customer */
          }}
          aria-label="Create new customer"
        >
          New Customer
        </Button>
      </div>

      {!filteredCustomers || filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No customers found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer._id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{customer.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="text-muted-foreground inline">City: </dt>
                    <dd className="inline">{customer.address.city}</dd>
                  </div>
                  {customer.email && (
                    <div>
                      <dt className="text-muted-foreground inline">Email: </dt>
                      <dd className="inline">{customer.email}</dd>
                    </div>
                  )}
                  {customer.phone && (
                    <div>
                      <dt className="text-muted-foreground inline">Phone: </dt>
                      <dd className="inline">{customer.phone}</dd>
                    </div>
                  )}
                  {customer.rating && (
                    <div>
                      <dt className="text-muted-foreground inline">Rating: </dt>
                      <dd className="inline font-semibold">{customer.rating}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

