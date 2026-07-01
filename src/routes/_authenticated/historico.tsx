import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { listLaudos, deleteLaudo } from "@/lib/laudos.functions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({ meta: [{ title: "Histórico — Fast Laudo" }] }),
  component: Historico,
});

type Laudo = {
  id: string;
  patient_name: string;
  document_type: string;
  generated_content: string;
  created_at: string;
};

function Historico() {
  const list = useServerFn(listLaudos);
  const del = useServerFn(deleteLaudo);
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState<Laudo | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["laudos"],
    queryFn: () => list(),
  });

  const onDelete = async (id: string) => {
    try {
      await del({ data: { id } });
      queryClient.invalidateQueries({ queryKey: ["laudos"] });
      toast.success("Documento excluído.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  const laudos = (data ?? []) as Laudo[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Histórico de Pacientes</h1>
        <p className="text-sm text-muted-foreground">Todos os laudos que você já gerou.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Carregando...</div>
        ) : laudos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nenhum documento ainda. Gere seu primeiro laudo no Dashboard.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laudos.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.patient_name}</TableCell>
                  <TableCell className="text-muted-foreground">{l.document_type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(l.created_at), "dd 'de' MMM, yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewing(l)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O laudo de {l.patient_name} será
                              removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(l.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewing?.document_type} — {viewing?.patient_name}
            </DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {viewing?.generated_content}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
