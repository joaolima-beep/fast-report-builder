import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Fast Laudo" }] }),
  component: Configuracoes,
});

function Configuracoes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .maybeSingle();
      setName(profile?.full_name ?? "");
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: u.user.id, email, full_name: name });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil atualizado.");
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie seu perfil e sua conta.</p>
      </div>

      <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Perfil
        </h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={save} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive">
          Conta
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Encerrar sua sessão neste dispositivo.</p>
        <div className="mt-4">
          <Button variant="outline" onClick={signOut}>
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
