// Server-only Lovable AI Gateway client.
export async function callLovableAI(params: {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY não configurada.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429)
      throw new Error("Limite de requisições excedido. Tente novamente em instantes.");
    if (res.status === 402)
      throw new Error("Créditos de IA insuficientes. Adicione créditos ao workspace.");
    throw new Error(`Falha na IA (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}
