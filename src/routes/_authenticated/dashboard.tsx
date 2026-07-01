import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateLaudo } from "@/lib/laudos.functions";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Fast Laudo" }] }),
  component: Dashboard,
});

type DocType = "Relatório de Evolução" | "Parecer Psicológico" | "Laudo Técnico";

function Dashboard() {
  const generate = useServerFn(generateLaudo);
  const queryClient = useQueryClient();

  const [patientName, setPatientName] = useState("");
  const [documentType, setDocumentType] = useState<DocType>("Laudo Técnico");
  const [rawNotes, setRawNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!patientName.trim() || rawNotes.trim().length < 10) {
      toast.error("Informe o nome do paciente e ao menos 10 caracteres de anotação.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const result = await generate({
        data: { patientName: patientName.trim(), documentType, rawNotes: rawNotes.trim() },
      });
      setOutput(result.generated_content);
      queryClient.invalidateQueries({ queryKey: ["laudos"] });
      toast.success("Laudo gerado e salvo no histórico.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar laudo");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Texto copiado.");
  };

  const exportPdf = () => {
    if (!output) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const safe = output.replace(/</g, "&lt;");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${documentType} - ${patientName}</title>
      <style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.6;color:#1a1a2e;white-space:pre-wrap}h1{font-size:18px;text-align:center;margin-bottom:24px;text-transform:uppercase}</style>
      </head><body><h1>${documentType}</h1>${safe}<script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Novo documento</h1>
        <p className="text-sm text-muted-foreground">
          Cole suas anotações e gere um documento técnico formatado.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Entrada
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="patient">Nome do paciente</Label>
              <Input
                id="patient"
                placeholder="Ex.: João da Silva"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tipo de documento</Label>
              <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relatório de Evolução">Relatório de Evolução</SelectItem>
                  <SelectItem value="Parecer Psicológico">Parecer Psicológico</SelectItem>
                  <SelectItem value="Laudo Técnico">Laudo Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Anotações brutas da sessão</Label>
              <Textarea
                id="notes"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Digite ou cole aqui as anotações da sessão..."
                className="min-h-[280px] resize-y"
              />
            </div>

            <Button
              onClick={onGenerate}
              disabled={loading}
              size="lg"
              className="w-full shadow-[var(--shadow-glow)]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Gerar Laudo Técnico com IA
            </Button>
          </div>
        </section>

        {/* Output */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Documento gerado
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={exportPdf} disabled={!output}>
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          <div className="mt-4 min-h-[420px] rounded-xl border border-border bg-secondary/40 p-5 text-sm leading-relaxed">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando documento...
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap font-sans">{output}</pre>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <FileText className="mb-3 h-8 w-8 opacity-50" />
                <p className="text-sm">
                  O laudo formatado aparecerá aqui após a geração.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
