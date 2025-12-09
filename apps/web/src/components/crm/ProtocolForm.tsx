import { useState, useEffect } from "react";
import { useProtocol } from "@/hooks/useProtocol";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

export function ProtocolForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { protocol, loading, saveProtocol } = useProtocol(id);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    customerId: "", // In a real app, this would be selected or passed via context
    participants: "", // Comma separated for now
    summary: "",
  });

  useEffect(() => {
    if (protocol) {
      setFormData({
        title: protocol.title || "",
        date: protocol.date
          ? protocol.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        customerId: protocol.customerId || "",
        participants: protocol.participants?.join(", ") || "",
        summary: protocol.summary || "",
      });
    }
  }, [protocol]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, summary: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const participantsList = formData.participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      await saveProtocol({
        ...formData,
        participants: participantsList,
        type: "protocol",
      } as any);
      navigate("/protocols");
    } catch (err) {
      console.error("Failed to save protocol", err);
    }
  };

  if (loading) return <div>Lade...</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Protokoll bearbeiten" : "Neues Protokoll"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Kunde (ID)</Label>
              <Input
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="Customer ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titel / Betreff</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="z.B. Jahresgespräch 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Teilnehmer</Label>
            <Input
              id="participants"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              placeholder="Person A, Person B, ..."
            />
            <p className="text-xs text-muted-foreground">
              Durch Komma getrennt
            </p>
          </div>

          <div className="space-y-2">
            <Label>Inhalt / Notizen</Label>
            <RichTextEditor
              value={formData.summary}
              onChange={handleEditorChange}
              className="min-h-[300px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/protocols")}
            >
              Abbrechen
            </Button>
            <Button type="submit">Speichern</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
