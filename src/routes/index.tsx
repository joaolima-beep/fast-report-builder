import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, FileText, Brain, ShieldCheck, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Fast Laudo</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground">
              Benefícios
            </a>
            <a
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Como funciona
            </a>
            <a href="#precos" className="text-sm text-muted-foreground hover:text-foreground">
              Preços
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Entrar
            </Link>
            <Link to="/auth">
              <Button size="sm">Criar Conta Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/60 via-background to-background" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Feito para psicólogos e terapeutas
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Laudos técnicos em minutos, <span className="text-primary">com precisão clínica.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Transforme suas anotações de sessão em laudos, pareceres e relatórios de evolução
            formatados, com linguagem técnica adequada e prontos para entrega.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="shadow-[var(--shadow-glow)]">
                Criar Conta Grátis
              </Button>
            </Link>
            <a href="#precos">
              <Button size="lg" variant="outline">
                Ver preços
              </Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Economize horas por semana",
              desc: "O que levava 40 minutos, agora leva 2.",
            },
            {
              icon: Brain,
              title: "Linguagem clínica adequada",
              desc: "IA treinada para redação técnica em psicologia.",
            },
            {
              icon: ShieldCheck,
              title: "Seus dados protegidos",
              desc: "Histórico privado, acessível apenas por você.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Três passos simples entre a sessão e o documento pronto.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Cole suas anotações",
                d: "Digite ou cole as anotações brutas da sessão.",
              },
              {
                n: "02",
                t: "Escolha o tipo",
                d: "Relatório de Evolução, Parecer ou Laudo Técnico.",
              },
              { n: "03", t: "Gere e exporte", d: "Copie o texto ou exporte em PDF." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-sm font-bold text-primary">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight">Um plano. Tudo incluso.</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Sem pegadinhas nem cobranças por documento gerado.
        </p>

        <div className="mx-auto mt-12 max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 shadow-[var(--shadow-glow)]">
            <div className="absolute right-6 top-6 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              Mais popular
            </div>
            <h3 className="text-lg font-semibold">Plano Mensal</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight">R$ 39,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Laudos, pareceres e relatórios ilimitados",
                "Exportação em PDF",
                "Histórico completo de pacientes",
                "Suporte por e-mail",
                "Dados protegidos e privados",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth" className="mt-8 block">
              <Button size="lg" className="w-full">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fast Laudo. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
