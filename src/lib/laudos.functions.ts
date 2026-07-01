import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DocType = z.enum(["Relatório de Evolução", "Parecer Psicológico", "Laudo Técnico"]);

const GenerateInput = z.object({
  patientName: z.string().trim().min(1).max(120),
  documentType: DocType,
  rawNotes: z.string().trim().min(10).max(8000),
});

export const generateLaudo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data, context }) => {
    const { callLovableAI } = await import("./ai-gateway.server");

    const systemPrompt = `Você é um psicólogo clínico experiente redigindo documentos técnicos em português do Brasil.
Escreva com linguagem formal, técnica e ética, seguindo diretrizes do Conselho Federal de Psicologia (Resolução CFP 06/2019).
Estruture claramente o documento com títulos e seções apropriadas ao tipo solicitado.
Nunca invente dados; se algo faltar nas anotações, use termos genéricos como "conforme relato" ou omita.
Nunca faça diagnósticos definitivos além do que as anotações permitirem.
Retorne apenas o corpo do documento formatado (sem comentários introdutórios).`;

    const structureByType: Record<string, string> = {
      "Relatório de Evolução":
        "Estrutura: Identificação; Período de acompanhamento; Demanda inicial; Evolução do quadro; Intervenções realizadas; Considerações e encaminhamentos.",
      "Parecer Psicológico":
        "Estrutura: Identificação; Demanda e objetivo do parecer; Análise psicológica; Conclusão parcial.",
      "Laudo Técnico":
        "Estrutura: Identificação; Demanda; Procedimentos utilizados; Análise; Conclusão; Encaminhamentos.",
    };

    const userPrompt = `Tipo de documento: ${data.documentType}
Paciente: ${data.patientName}
${structureByType[data.documentType]}

Anotações brutas da sessão:
"""
${data.rawNotes}
"""

Gere o ${data.documentType.toLowerCase()} completo, formatado em texto simples com títulos de seção em MAIÚSCULAS.`;

    const content = await callLovableAI({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    if (!content) throw new Error("Nenhum conteúdo gerado pela IA.");

    const { data: inserted, error } = await context.supabase
      .from("laudos")
      .insert({
        user_id: context.userId,
        patient_name: data.patientName,
        document_type: data.documentType,
        raw_notes: data.rawNotes,
        generated_content: content,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

export const listLaudos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("laudos")
      .select("id, patient_name, document_type, generated_content, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteLaudo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("laudos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
