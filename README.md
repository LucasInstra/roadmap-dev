# Roadmap: estagiário .NET para júnior com IA aplicada

Dashboard visual da trilha de estudo: certificações Azure, artefatos por etapa, leitura e prática no trabalho.

## Rodar

```bash
cd app
bun install
bun run dev
```

Build de produção:

```bash
bun run build
```

O `build` roda `tsc --noEmit` antes do Vite.

## Funcionalidades

- Trilha em quatro etapas com links oficiais, guia de estudo, artefato e critério de saída
- Progresso por etapa e global, salvo em `localStorage`
- Evidência por item, anotações por etapa e meta opcional
- Export e import de progresso em JSON
- Referência de leitura, prática no trabalho, custo no Azure e teste de seis meses

## Estrutura

- `app/`: aplicação React + Vite (versão atual)
- `index.html`: versão estática anterior, mantida como referência

## Stack

React, Vite, Tailwind CSS, beUI (componentes de movimento), Glisse (liquid glass), Cascadia Mono.
