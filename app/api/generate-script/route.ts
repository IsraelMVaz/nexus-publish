import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getChannel, type ChannelId } from "@/lib/channels";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { channelId, tema } = await req.json();

    if (!channelId || !tema) {
      return Response.json(
        { error: "channelId e tema são obrigatórios" },
        { status: 400 }
      );
    }

    const channel = getChannel(channelId as ChannelId);
    if (!channel) {
      return Response.json({ error: "Canal inválido" }, { status: 400 });
    }

    const model = google("gemini-3.8-flash");

    const { text } = await generateText({
      model,
      system: channel.systemPrompt,
      prompt: `Tema do vídeo: ${tema}

Gere o roteiro completo e pronto para narração para o canal "${channel.name}".`,
      temperature: 0.7,
      maxTokens: 4000,
    });

    return Response.json({
      success: true,
      channel: channel.name,
      tema,
      model: "gemini-3.8-flash",
      roteiro: text,
    });
  } catch (error: any) {
    console.error("Erro ao gerar roteiro:", error);
    return Response.json(
      {
        error: "Falha ao gerar roteiro",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}