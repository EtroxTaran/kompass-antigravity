import { useNavigate } from "react-router-dom";
import { useProtocols } from "@/hooks/useProtocol";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export function ProtocolList() {
  const navigate = useNavigate();
  const { protocols, loading } = useProtocols();

  if (loading) return <div>Lade Protokolle...</div>;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Besuchsprotokolle</CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/protocols/new")}>
            <Plus className="mr-2 h-4 w-4" /> Neues Protokoll
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Teilnehmer</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Keine Protokolle gefunden.
                  </TableCell>
                </TableRow>
              ) : (
                protocols.map((protocol) => (
                  <TableRow
                    key={protocol._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/protocols/${protocol._id}/edit`)}
                  >
                    <TableCell>{formatDate(protocol.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {protocol.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {protocol.participants?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {protocol.nextActions?.length || 0} ToDos
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
