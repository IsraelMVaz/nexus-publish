"use client";

import { useState } from "react";
import { CHANNELS, type ChannelId } from "@/lib/channels";

type Section = "visao" | "tokens" | "notificacoes" | "agenda" | "canais";

const MENU: { id: Section; label: string; icon: string }[] = [
  { id: "visao", label: "Visão geral", icon: "◈" },
  { id: "tokens", label: "Tokens & IA", icon: "⌁" },
  { id: "notificacoes", label: "Notificações", icon: "◉" },
  { id: "agenda", label: "Agenda", icon: "▣" },
  { id: "canais", label: "Canais", icon: "✦" },
];

export default function Home() {
  const [section, setSection] = useState<Section>("canais");
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

  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-800 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">N</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">NEXUS</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              Control Center · Canais
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {MENU.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === item.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "notificacoes" && (
                <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-800 text-[11px] text-gray-600">
          NEXUS / interface v0.2
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-gray-500">MONITOR PESSOAL · 01</div>
            <div className="text-sm font-medium">Olá, Israel.</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-gray-300">{timeStr}</div>
            <div className="text-[11px] text-gray-500 capitalize">{dateStr}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* ========== VISÃO GERAL ========== */}
          {section === "visao" && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-semibold">Visão geral</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Aqui está o pulso da sua operação agora.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "CPU", value: "—", status: "aguardando" },
                  { label: "Memória RAM", value: "—", status: "aguardando" },
                  { label: "GPU", value: "—", status: "aguardando" },
                  { label: "Bateria", value: "—", status: "indisponível" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-4"
                  >
                    <div className="text-xs text-gray-500 mb-2">{card.label}</div>
                    <div className="text-lg font-medium">{card.value}</div>
                    <div className="text-[11px] text-gray-600 mt-1">{card.status}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">Atividade do sistema</div>
                    <div className="text-[11px] text-gray-500">últimas 24h</div>
                  </div>
                  <div className="h-32 flex items-end gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500/20 rounded-t"
                        style={{
                          height: `${20 + Math.sin(i / 3) * 40 + (i % 5) * 8}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium mb-3">Notificações</div>
                  <div className="text-xs text-gray-500">
                    Nenhuma integração conectada ainda.
                  </div>
                  <button
                    onClick={() => setSection("notificacoes")}
                    className="mt-4 text-xs text-emerald-400 hover:underline"
                  >
                    Ver detalhes →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium mb-1">Consumo de IA</div>
                  <div className="text-xs text-gray-500 mb-3">Gemini ativo</div>
                  <div className="text-2xl font-semibold text-emerald-400">Ativo</div>
                  <button
                    onClick={() => setSection("tokens")}
                    className="mt-3 text-xs text-emerald-400 hover:underline"
                  >
                    Abrir módulo →
                  </button>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium mb-1">Agenda unificada</div>
                  <div className="text-xs text-gray-500 mb-3">
                    Google Agenda não conectado
                  </div>
                  <button
                    onClick={() => setSection("agenda")}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Ver conexão →
                  </button>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                  <div className="text-sm font-medium mb-1">Canais</div>
                  <div className="text-xs text-gray-500 mb-3">5 canais configurados</div>
                  <button
                    onClick={() => setSection("canais")}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Abrir Central de Canais →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========== TOKENS & IA ========== */}
          {section === "tokens" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-semibold">Tokens & IA</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Acompanhe consumo por agente e conecte fontes de IA.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Google Gemini</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Modelo: gemini-3.8-flash · Status: conectado
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Ativo
                  </span>
                </div>
                <div className="h-px bg-gray-800" />
                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <div className="font-medium">OpenAI</div>
                    <div className="text-xs text-gray-500 mt-0.5">Não configurado</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-500">
                    Inativo
                  </span>
                </div>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                <div className="text-sm font-medium mb-2">Uso recente</div>
                <p className="text-xs text-gray-500">
                  O consumo detalhado por roteiro será exibido aqui nas próximas versões.
                </p>
              </div>
            </div>
          )}

          {/* ========== NOTIFICAÇÕES ========== */}
          {section === "notificacoes" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-semibold">Notificações</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Alertas e avisos da operação.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Central de Canais pronta",
                    desc: "Geração de roteiros com Gemini está ativa.",
                    time: "agora",
                  },
                  {
                    title: "Integrações pendentes",
                    desc: "Gmail, Agenda e WhatsApp ainda não conectados.",
                    time: "hoje",
                  },
                  {
                    title: "Agente local",
                    desc: "Agente local desconectado (opcional).",
                    time: "hoje",
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
                      <div className="text-[11px] text-gray-600 mt-1">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== AGENDA ========== */}
          {section === "agenda" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-semibold">Agenda</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Agenda unificada da operação.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Google Agenda</div>
                <p className="text-xs text-gray-500 mb-4">
                  Conecte sua conta para ver eventos e programar publicações.
                </p>
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-700 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                  Conectar Google Agenda
                </button>
              </div>
            </div>
          )}

          {/* ========== CANAIS ========== */}
          {section === "canais" && (
            <div className="max-w-5xl">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-1">Central de Canais</h2>
                <p className="text-gray-400 text-sm">
                  Agente roteirista para criar vídeos longos, organizados por canal.
                  Gera roteiro completo pronto para narração.
                </p>
              </div>

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

              {erro && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
                  {erro}
                </div>
              )}

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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}