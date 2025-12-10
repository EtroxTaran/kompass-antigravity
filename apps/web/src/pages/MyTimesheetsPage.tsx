import { MainLayout } from "@/components/layout/MainLayout";
import { TimeTrackingList } from "@/components/pm/TimeTrackingList";

export function MyTimesheetsPage() {
    return (
        <MainLayout
            userRole="PM" // Or general user role, assuming PM for now or basic access
            breadcrumbs={[{ label: "My Timesheets", href: "/timesheets/my" }]}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Timesheets</h1>
                    <p className="text-muted-foreground">
                        Track your working hours and activities.
                    </p>
                </div>

                <TimeTrackingList userId="me" />
            </div>
        </MainLayout>
    );
}
