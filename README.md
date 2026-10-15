# Nexus · Central de Canais

Sistema de geração de roteiros completos prontos para narração para os 5 canais YouTube.

## Canais suportados

| Canal | Idioma | Modelo |
|-------|--------|--------|
| Pequenas Histórias da Bíblia | PT | GPT-4o |
| Clube dos Bichinhos | PT | GPT-4o |
| Venda com IA | PT | GPT-4o |
| Little Bible Tales | EN | Gemini 1.5 Pro |
| Happy Animal Club | EN | Gemini 1.5 Pro |

## Como rodar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env.local` com suas chaves:
   ```
   OPENAI_API_KEY=sk-...
   GOOGLE_GENERATIVE_AI_API_KEY=...
   ```
4. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```

## Deploy na Vercel

1. Importe o repositório na Vercel (ou conecte ao projeto existente `nexus-publish`)
2. Adicione as variáveis de ambiente:
   - `OPENAI_API_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
3. Deploy

Pronto. A Central de Canais gera roteiros completos prontos para narração.