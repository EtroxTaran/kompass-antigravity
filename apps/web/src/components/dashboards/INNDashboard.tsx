import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Phone, Plus } from "lucide-react";
import { useUserTasks } from "@/hooks/useUserTasks";
import { useOffers } from "@/hooks/useOffers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function INNDashboard() {
  const navigate = useNavigate();
  const { tasks } = useUserTasks("current-user-id"); // TODO: Get real user ID
  const { offers } = useOffers();

  const myTasks = tasks.filter((t) => t.status !== "completed").slice(0, 5);
  const myOffers = offers.slice(0, 5); // Ideally filtered by owner or inside sales pool

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inside Sales Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/sales/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Lead
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              My Tasks
            </CardTitle>
            <CardDescription>Daily todo list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No pending tasks.
                    </TableCell>
                  </TableRow>
                ) : (
                  myTasks.map((task) => (
                    <TableRow
                      key={task._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/tasks`)}
                    >
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        {task.dueDate
                          ? format(new Date(task.dueDate), "dd.MM")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Recent Offers / Leads
            </CardTitle>
            <CardDescription>
              Recent activity requiring follow-up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOffers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      No recent offers.
                    </TableCell>
                  </TableRow>
                ) : (
                  myOffers.map((offer) => (
                    <TableRow
                      key={offer._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/sales/offers/${offer._id}`)}
                    >
                      <TableCell className="font-mono">
                        {offer.offerNumber || "DRAFT"}
                      </TableCell>
                      <TableCell>{offer.customerId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
