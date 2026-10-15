"use client";

import { useState } from "react";
import { CHANNELS, type ChannelId } from "@/lib/channels";

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelId | null>(null);
  const [tema, setTema] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    channel: string;
    tema: string;
    model: string;
    roteiro: string;
  } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function gerarRoteiro() {
    if (!selectedChannel || !tema.trim()) {
      setErro("Selecione um canal e digite o tema.");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: selectedChannel, tema: tema.trim() }),
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          text?.slice(0, 200) ||
            "Resposta inválida do servidor. Tente novamente em alguns segundos."
        );
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || "Erro ao gerar roteiro");
      }

      if (!data.roteiro) {
        throw new Error("Roteiro não foi gerado. Tente novamente.");
      }

      setResultado({
        channel: data.channel,
        tema: data.tema,
        model: data.model,
        roteiro: data.roteiro,
      });
    } catch (err: any) {
      setErro(err.message || "Falha na geração");
    } finally {
      setLoading(false);
    }
  }

  function copiarRoteiro() {
    if (resultado?.roteiro) {
      navigator.clipboard.writeText(resultado.roteiro);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">NEXUS</h1>
            <p className="text-xs text-gray-500">CONTROL CENTER · CANAIS</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">Central de Canais</div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-1">Central de Canais</h2>
          <p className="text-gray-400 text-sm">
            Agente roteirista para criar vídeos longos, organizados por canal.
            Gera roteiro completo pronto para narração.
          </p>
        </div>

        {/* Channel selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedChannel === channel.id
                  ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
              }`}
            >
              <div className="font-medium text-sm">{channel.name}</div>
              <div className="text-xs text-gray-500 mt-1">{channel.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Escolha um canal e informe o tema
          </label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Tema do vídeo (ex: Noé e a Arca, Como acompanhar orçamentos...)"
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && !loading && gerarRoteiro()}
          />
          <button
            onClick={gerarRoteiro}
            disabled={loading || !selectedChannel || !tema.trim()}
            className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Gerando roteiro completo..." : "Gerar roteiro completo"}
          </button>
        </div>

        {/* Error */}
        {erro && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
            {erro}
          </div>
        )}

        {/* Result */}
        {resultado && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <div className="font-medium">{resultado.channel}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Tema: {resultado.tema} · Modelo: {resultado.model}
                </div>
              </div>
              <button
                onClick={copiarRoteiro}
                className="text-xs px-3 py-1.5 rounded-md border border-gray-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Copiar roteiro
              </button>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-sans">
                {resultado.roteiro}
              </pre>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500 text-sm">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p>Gerando roteiro completo pronto para narração...</p>
            <p className="text-xs mt-1">Isso pode levar alguns segundos</p>
          </div>
        )}
      </main>
    </div>
  );
}