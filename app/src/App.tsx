import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Copy,
  Download,
  GraduationCap,
  RotateCcw,
  Route,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Terminal,
  Upload,
  Wallet,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/motion/card";
import { Checkbox } from "@/components/motion/checkbox";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { NumberTicker } from "@/components/motion/number-ticker";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Glass, Menu, TabBar } from "glisse";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ data */

type Kind = "pre" | "cert" | "art" | "opt";

type Item = { id: string; label: string; href?: string; course?: string };

type ExtLink = { label: string; href: string };

type Stage = {
  id: string;
  step: string;
  title: string;
  kind: Kind;
  meta: string[];
  why: string;
  items: Item[];
  links: ExtLink[];
  guide: string[];
  artifact?: string;
  goal?: string;
  caveat?: string;
};

const stages: Stage[] = [
  {
    id: "py",
    step: "Etapa 0",
    title: "Ponte de Python",
    kind: "pre",
    meta: ["sem exame", "só o necessário"],
    why: "Você vem de C#. O objetivo não é virar dev Python, é ler e adaptar os exemplos da Microsoft sem travar.",
    links: [
      {
        label: "Tutorial oficial de Python",
        href: "https://docs.python.org/3/tutorial/",
      },
      {
        label: "Conta gratuita do Azure",
        href: "https://azure.microsoft.com/free/",
      },
    ],
    guide: [
      "Não estude Python inteiro. Estude o que aparece nos samples: request, JSON, async e ambiente virtual.",
      "Meta prática: ler um script de 30 linhas e explicar cada linha sem executar.",
      "O que não aparece em sample, ignore. O exame cobra Foundry, não a linguagem.",
    ],
    items: [
      {
        id: "py1",
        label: "Sintaxe, tipos, listas e dicionários",
        href: "https://docs.python.org/3/tutorial/introduction.html",
        course: "https://realpython.com/python-basics/",
      },
      {
        id: "py2",
        label: "Comprehensions e funções",
        href: "https://docs.python.org/3/tutorial/datastructures.html",
        course: "https://realpython.com/list-comprehension-python/",
      },
      {
        id: "py3",
        label: "async e await",
        href: "https://docs.python.org/3/library/asyncio-task.html",
        course: "https://realpython.com/async-io-python/",
      },
      {
        id: "py4",
        label: "pip e ambiente virtual",
        href: "https://docs.python.org/3/library/venv.html",
        course: "https://realpython.com/python-virtual-environments-a-primer/",
      },
      {
        id: "py5",
        label: "HTTP e JSON com requests ou httpx",
        href: "https://www.python-httpx.org/quickstart/",
        course: "https://realpython.com/python-requests/",
      },
      {
        id: "py6",
        label: "SDK do Foundry e leitura de sample",
        href: "https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code",
        course: "https://github.com/microsoft/generative-ai-for-beginners",
      },
    ],
    goal: "Ler um sample de Foundry e explicar linha por linha sem executar.",
    caveat:
      "Não estudar: orientação a objetos profunda, Django, pandas, ciência de dados. Isso é outro caminho.",
  },
  {
    id: "ai901",
    step: "Etapa 1",
    title: "AI-901 · Azure AI Fundamentals",
    kind: "cert",
    meta: [
      "~45 min",
      "corte 700",
      "40-45% conceitos",
      "55-60% Foundry",
      "pt-BR",
      "exame pago",
    ],
    why: "Ponto de entrada. Serve para vocabulário e para passar filtro de recrutador. A trilha de estudo é gratuita; só o exame é pago, com valor por país.",
    links: [
      {
        label: "Exame AI-901",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/",
      },
      {
        label: "Study guide oficial",
        href: "https://aka.ms/AI901-StudyGuide",
      },
      {
        label: "Practice Assessment",
        href: "https://aiskillsnavigator.microsoft.com/",
      },
      {
        label: "Sandbox do exame",
        href: "https://go.microsoft.com/fwlink/?linkid=2226877",
      },
    ],
    guide: [
      "40 a 45% é conceito, 55 a 60% é Foundry. Estude pelo peso, não pela ordem do módulo.",
      "Faça o Practice Assessment antes de comprar o voucher. Sem folga, não agende.",
      "Confira a data de atualização do study guide antes de marcar a prova. O exame muda.",
    ],
    items: [
      {
        id: "a1",
        label: "Percorrer as trilhas do Microsoft Learn",
        href: "https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/",
      },
      {
        id: "a2",
        label: "Ler o study guide oficial, que é o syllabus real",
        href: "https://aka.ms/AI901-StudyGuide",
        course: "https://learn.microsoft.com/en-us/shows/exam-readiness-zone/",
      },
      {
        id: "a3",
        label: "Fazer o Practice Assessment no AI Skills Navigator",
        href: "https://aiskillsnavigator.microsoft.com/",
        course: "https://go.microsoft.com/fwlink/?linkid=2226877",
      },
      {
        id: "a4",
        label: "Agendar e fazer o exame",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/",
      },
    ],
    artifact:
      "Script Python que chama modelo no Foundry, recebe resposta em streaming e imprime tokens e latência.",
    goal: "Passar com folga no Practice Assessment antes de pagar o voucher.",
  },
  {
    id: "ai103",
    step: "Etapa 2",
    title: "AI-103 · Azure AI Apps and Agents Developer Associate",
    kind: "cert",
    meta: ["120 min", "proctored", "pt-BR", "exige Python + Foundry", "exame pago"],
    why: "É a certificação que a Microsoft mapeia oficialmente para o cargo AI Engineer. É a peça central do roadmap.",
    links: [
      {
        label: "Página da certificação",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
      },
      {
        label: "Study guide oficial",
        href: "https://aka.ms/AI103-StudyGuide",
      },
      {
        label: "Agent Framework",
        href: "https://learn.microsoft.com/en-us/agent-framework/overview/",
      },
      {
        label: "Microsoft.Extensions.AI",
        href: "https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai",
      },
      {
        label: "Foundry Local",
        href: "https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local",
      },
    ],
    guide: [
      "Cinco domínios. Generativo e agêntico é o maior e o que mais pesa na prática.",
      "Exige experiência com Python e Foundry. Sem ter construído um agente, o exame vira decoreba.",
      "Depois de cada domínio, reimplemente o artefato em C#. O certificado é Python; o seu trabalho é .NET.",
    ],
    items: [
      {
        id: "b1",
        label: "Planejar e gerenciar uma solução de IA no Azure",
        href: "https://aka.ms/AI103-StudyGuide",
      },
      {
        id: "b2",
        label: "Soluções generativas e agênticas",
        href: "https://learn.microsoft.com/en-us/azure/foundry/agents/overview",
        course: "https://github.com/microsoft/ai-agents-for-beginners",
      },
      {
        id: "b3",
        label: "Visão computacional",
        href: "https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/",
        course:
          "https://learn.microsoft.com/en-us/training/paths/insight-visual-data/",
      },
      {
        id: "b4",
        label: "Análise de texto",
        href: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/",
        course:
          "https://learn.microsoft.com/en-us/training/paths/develop-language-solutions-azure-ai/",
      },
      {
        id: "b5",
        label: "Extração de informação",
        href: "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/",
        course:
          "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api",
      },
      {
        id: "b6",
        label: "Agendar e fazer o exame",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
      },
    ],
    artifact:
      "Agente com 3 ferramentas, teto de custo por execução e 20 casos de avaliação com taxa de acerto registrada.",
    goal: "Explicar sem consultar o que é um eval, por que existe e como medir custo por resposta.",
    caveat:
      "Traduzir para C#: reimplemente o artefato com Microsoft.Extensions.AI (IChatClient, IEmbeddingGenerator, middleware). O exame é Python; o seu emprego é .NET.",
  },
  {
    id: "az204",
    step: "Etapa 3",
    title: "AZ-204 · Azure Developer Associate",
    kind: "opt",
    meta: ["~100 min", "se a empresa for Azure", "exame pago"],
    why: "Não é IA, é o seu stack. Vale por promoção interna e por credibilidade em conversa de arquitetura. Se a Instramed for on-premise ou AWS, pule.",
    links: [
      {
        label: "Página da certificação",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
      },
      {
        label: "Conta gratuita do Azure",
        href: "https://azure.microsoft.com/free/",
      },
    ],
    guide: [
      "Só faça se a Instramed for Azure. Certificado de nuvem que a empresa não usa não vira conversa interna.",
      "Key Vault, App Insights e App Service cobrem a maior parte do que você usa no dia a dia.",
    ],
    items: [
      { id: "c1", label: "Confirmar com o time se a nuvem é Azure" },
      {
        id: "c2",
        label: "Compute, storage e segurança",
        href: "https://aka.ms/AZ204-StudyGuide",
        course:
          "https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore",
      },
      {
        id: "c3",
        label: "Key Vault e Application Insights",
        href: "https://learn.microsoft.com/en-us/azure/key-vault/general/overview",
        course:
          "https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-portal",
      },
      {
        id: "c4",
        label: "Agendar e fazer o exame",
        href: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
      },
    ],
    artifact:
      "App .NET publicado com segredos no Key Vault e telemetria no Application Insights.",
  },
];

const extras = [
  {
    id: "e1",
    href: "https://aka.ms/AI103-StudyGuide",
    title: "Study guides como syllabus",
    body: "O study guide do AI-103 lista exatamente o que o mercado espera. Vale ler mesmo sem fazer a prova.",
    check: "Ler o study guide do AI-103",
    icon: Terminal,
  },
  {
    id: "e2",
    href: "https://learn.microsoft.com/en-us/credentials/applied-skills/",
    title: "Microsoft Applied Skills",
    body: "Avaliações de cenário gratuitas, sem proctoring, com credencial verificável. Três em um fim de semana.",
    check: "Concluir 1 Applied Skill",
    icon: ShieldCheck,
  },
  {
    id: "e3",
    href: "https://aiskillsnavigator.microsoft.com/",
    title: "AI Skills Navigator",
    body: "Onde ficam os Practice Assessments. Termômetro antes de pagar qualquer voucher.",
    check: "Rodar um Practice Assessment",
    icon: Compass,
  },
  {
    id: "e4",
    href: "https://learn.microsoft.com/en-us/azure/foundry-local/what-is-foundry-local",
    title: "Foundry Local",
    body: "Rodar modelo no dispositivo. Em software médico, dado de paciente não sai da máquina.",
    check: "Rodar um modelo local com SDK em C#",
    icon: Terminal,
  },
];

const books = [
  {
    id: "l1",
    href: "https://web.stanford.edu/~ouster/cgi-bin/book.php",
    title: "A Philosophy of Software Design",
    author: "Ousterhout · 2ª ed. · ~190 pp",
    why: "Complexidade, módulos profundos, interfaces. Melhor custo por página que existe.",
    when: "Antes do AI-901",
  },
  {
    id: "l2",
    href: "https://abseil.io/resources/swe-book",
    title: "Software Engineering at Google",
    author: "edição gratuita online",
    why: "Code review, testes, deprecação. O que uma empresa grande espera de você.",
    when: "Em paralelo",
  },
  {
    id: "l3",
    href: "https://huyenchip.com/books/",
    title: "AI Engineering",
    author: "Chip Huyen · 2025",
    why: "A referência da área. Comece pelos capítulos de avaliação e custo.",
    when: "Durante o AI-103",
  },
  {
    id: "l4",
    href: "",
    title: "Working Effectively with Legacy Code",
    author: "Feathers · caps. 1, 2, 4, 9, 25",
    why: "Seams e testes de caracterização. O seu dia a dia em WPF sem testes.",
    when: "Depois",
  },
  {
    id: "l5",
    href: "https://www.computer.org/education/bodies-of-knowledge/software-engineering",
    title: "SWEBOK v4.0a",
    author: "gratuito · referência",
    why: "Mapa das 18 áreas. Leia o capítulo que a tarefa pede.",
    when: "Consulta",
  },
  {
    id: "l6",
    href: "https://martinfowler.com/books/refactoring.html",
    title: "Refactoring",
    author: "Fowler · caps. 1 a 4",
    why: "O catálogo vira consulta. Os quatro primeiros capítulos são o que importa.",
    when: "Consulta",
  },
  {
    id: "l7",
    href: "https://itrevolution.com/product/accelerate/",
    title: "Accelerate",
    author: "Forsgren, Humble, Kim",
    why: "Explica o que seu gestor mede: lead time, deploy, MTTR.",
    when: "Antes da efetivação",
  },
];

const practice: {
  id: string;
  title: string;
  body: string;
  check: string;
  href?: string;
}[] = [
  {
    id: "p1",
    title: "Um módulo seu",
    body: "Não uma tarefa: um módulo que você conhece melhor que qualquer pessoa e que, se quebrar, ligam para você.",
    check: "Escolher o módulo",
  },
  {
    id: "p2",
    title: "Um incidente de verdade",
    body: "Acompanhar um chamado do começo ao fim e escrever o postmortem. Maior aprendizado por hora que existe.",
    check: "Escrever 1 postmortem",
    href: "https://sre.google/sre-book/postmortem-culture/",
  },
  {
    id: "p3",
    title: "Prova de funcionamento",
    body: "Build, teste, validação visual com print, e uma linha no MR: o que verifiquei e o que não verifiquei.",
    check: "Aplicar em 3 entregas",
  },
  {
    id: "p4",
    title: "Design doc de 1 página",
    body: "Contexto, alternativas, decisão e risco. Quase nenhum estagiário faz. Quem faz passa a ser convidado para decisão.",
    check: "Escrever 1 design doc",
    href: "https://www.industrialempathy.com/posts/design-docs-at-google/",
  },
  {
    id: "p5",
    title: "Nicho regulatório",
    body: "LGPD art. 11, RDC 657/2022 da ANVISA, IEC 62304, ISO 14971. Vantagem que nenhum curso de prompt dá.",
    check: "Ler os 4 e resumir em 1 página",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
  },
  {
    id: "p6",
    title: "Uma coisa pública",
    body: "Post técnico, palestra interna ou contribuição open source. Prova que você sabe explicar.",
    check: "Publicar 1 artefato",
  },
];

const costItems = [
  {
    id: "cost1",
    label: "Criar orçamento e alerta",
    href: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets",
  },
  {
    id: "cost2",
    label: "Conferir a camada gratuita",
    href: "https://azure.microsoft.com/en-us/pricing/free-services/",
  },
  {
    id: "cost3",
    label: "Apagar o resource group",
    href: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group",
  },
];

const traps = [
  {
    id: "t1",
    title: "Ficar no fácil",
    description:
      "A IA é excelente no raso e bem especificado. Só aceitar essas tarefas constrói um portfólio raso e nunca te coloca diante de concorrência, estado, erro e legado.",
  },
  {
    id: "t2",
    title: "Nunca ser dono de uma falha",
    description:
      "Quem nunca quebrou e consertou não tem cicatriz. Sem cicatriz, ninguém confia em você com um problema em produção.",
  },
  {
    id: "t3",
    title: "Otimizar volume",
    description:
      "Dez features que ninguém revisa valem menos que uma pequena, testada e entendida pelo time. Volume sem confiança é dívida com o seu nome.",
  },
];

const testQuestions = [
  "Existe um módulo que é seu e que o time reconhece como seu?",
  "Você já diagnosticou sozinho um problema que a IA não resolveu?",
  "Você já escreveu uma decisão técnica que outra pessoa seguiu?",
  "Alguém já pediu sua opinião antes de decidir algo?",
];

const tabItems = [
  {
    value: "trilha",
    label: (
      <span className="flex items-center gap-1.5">
        <Route className="size-3.5" />
        Trilha
      </span>
    ),
  },
  {
    value: "extras",
    label: (
      <span className="flex items-center gap-1.5">
        <Sparkles className="size-3.5" />
        Extras
      </span>
    ),
  },
  {
    value: "leitura",
    label: (
      <span className="flex items-center gap-1.5">
        <BookOpen className="size-3.5" />
        Leitura
      </span>
    ),
  },
  {
    value: "pratica",
    label: (
      <span className="flex items-center gap-1.5">
        <Wrench className="size-3.5" />
        Prática
      </span>
    ),
  },
];

/* --------------------------------------------------------------- helpers */

const KIND_LABEL: Record<Kind, string> = {
  pre: "Pré-requisito",
  cert: "Certificação",
  art: "Artefato",
  opt: "Opcional",
};

const KIND_STYLE: Record<Kind, { chip: string; dot: string }> = {
  pre: {
    chip: "border-border text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
  cert: {
    chip: "border-border/80 text-foreground/75",
    dot: "rotate-45 rounded-[1px] bg-muted-foreground/80",
  },
  art: {
    chip: "border-border text-muted-foreground",
    dot: "rounded-[1px] bg-muted-foreground/60",
  },
  opt: {
    chip: "border-border/70 text-muted-foreground/80",
    dot: "border border-muted-foreground/50 bg-transparent",
  },
};

function Tag({ kind }: { kind: Kind }) {
  const style = KIND_STYLE[kind];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10.5px] tracking-wide uppercase",
        style.chip,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", style.dot)} />
      {KIND_LABEL[kind]}
    </span>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

function ExtLinkChip({ link }: { link: ExtLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-muted/25 px-2.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06] hover:text-foreground"
    >
      {link.label}
      <ArrowUpRight className="size-3 opacity-50 transition-opacity group-hover:opacity-100" />
    </a>
  );
}

function StudyLink({
  href,
  label,
  kind = "doc",
}: {
  href: string;
  label: string;
  kind?: "doc" | "course";
}) {
  const Icon = kind === "doc" ? BookOpen : GraduationCap;
  const text = kind === "doc" ? "Doc oficial" : "Curso ou guia";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${text}: ${label}`}
      title={text}
      className={cn(
        "mt-px grid size-5 shrink-0 place-items-center rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
        kind === "doc" ? "text-muted-foreground/50" : "text-primary/60",
      )}
    >
      <Icon className="size-3.5" />
    </a>
  );
}

function Note({
  label,
  children,
  tone = "primary",
}: {
  label: string;
  children: ReactNode;
  tone?: "primary" | "muted";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        tone === "primary"
          ? "border-primary/25 bg-primary/[0.06]"
          : "border-border bg-muted/30",
      )}
    >
      <div
        className={cn(
          "mb-1 font-mono text-[10px] tracking-[0.14em] uppercase",
          tone === "primary" ? "text-primary/85" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
      <div className="text-[13.5px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- component */

const STORAGE_KEY = "roadmap-beui-v1";
const NOTES_KEY = "roadmap-beui-notes-v1";
const EVIDENCE_KEY = "roadmap-beui-evidence-v1";
const TARGETS_KEY = "roadmap-beui-targets-v1";
const TABS = ["trilha", "extras", "leitura", "pratica"] as const;

function readStore(key: string): Record<string, string> {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function initialTab() {
  const hash = window.location.hash.replace("#", "");
  return (TABS as readonly string[]).includes(hash) ? hash : "trilha";
}

export default function App() {
  const [tab, setTab] = useState(initialTab);
  const [flash, setFlash] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    readStore(NOTES_KEY),
  );
  const [evidence, setEvidence] = useState<Record<string, string>>(() =>
    readStore(EVIDENCE_KEY),
  );
  const [targets, setTargets] = useState<Record<string, string>>(() =>
    readStore(TARGETS_KEY),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      /* storage unavailable */
    }
  }, [done]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      /* storage unavailable */
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(EVIDENCE_KEY, JSON.stringify(evidence));
    } catch {
      /* storage unavailable */
    }
  }, [evidence]);

  useEffect(() => {
    try {
      localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
    } catch {
      /* storage unavailable */
    }
  }, [targets]);

  const allIds = useMemo(
    () => [
      ...stages.flatMap((s) => s.items.map((i) => i.id)),
      ...extras.map((e) => e.id),
      ...costItems.map((c) => c.id),
      ...books.map((b) => b.id),
      ...practice.map((p) => p.id),
    ],
    [],
  );

  const total = allIds.length;
  const doneCount = allIds.filter((id) => done[id]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const toggle = (id: string, value: boolean) =>
    setDone((prev) => {
      if (!!prev[id] === value) return prev;
      const next = { ...prev };
      if (value) next[id] = true;
      else delete next[id];
      return next;
    });

  const flashMsg = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const reset = () => {
    if (
      !window.confirm(
        "Apagar progresso, anotações, evidências e metas deste navegador?",
      )
    ) {
      return;
    }
    setDone({});
    setNotes({});
    setEvidence({});
    setTargets({});
    flashMsg("limpo");
  };

  const nextStep = useMemo(() => {
    for (const stage of stages) {
      const item = stage.items.find((i) => !done[i.id]);
      if (item) return { stage, item };
    }
    return null;
  }, [done]);

  const copySummary = async () => {
    const lines = [`Roadmap .NET + IA · ${doneCount}/${total}`];
    for (const stage of stages) {
      const count = stage.items.filter((i) => done[i.id]).length;
      lines.push(
        `${stage.step} · ${stage.title}: ${count}/${stage.items.length}`,
      );
    }
    lines.push(
      `Extras: ${[...extras, ...costItems].filter((e) => done[e.id]).length}/${extras.length + costItems.length}`,
    );
    lines.push(
      `Leitura: ${books.filter((b) => done[b.id]).length}/${books.length}`,
    );
    lines.push(
      `Prática: ${practice.filter((p) => done[p.id]).length}/${practice.length}`,
    );
    if (nextStep) {
      lines.push(`Próximo: ${nextStep.stage.step} · ${nextStep.item.label}`);
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      flashMsg("copiado");
    } catch {
      flashMsg("clipboard bloqueado");
    }
  };

  const exportProgress = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      done,
      notes,
      evidence,
      targets,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `roadmap-progresso-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    flashMsg("exportado");
  };

  const importProgress = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== "object" || typeof data.done !== "object") {
        throw new Error("formato");
      }
      if (
        !window.confirm(
          "Substituir o progresso atual pelo conteúdo do arquivo?",
        )
      ) {
        return;
      }
      const cleanDone: Record<string, boolean> = {};
      for (const [key, value] of Object.entries(
        data.done as Record<string, unknown>,
      )) {
        if (value === true && allIds.includes(key)) cleanDone[key] = true;
      }
      const cleanStrings = (source: unknown) => {
        const out: Record<string, string> = {};
        if (!source || typeof source !== "object") return out;
        for (const [key, value] of Object.entries(
          source as Record<string, unknown>,
        )) {
          if (typeof value === "string" && value.length <= 2000) {
            out[key] = value;
          }
        }
        return out;
      };
      setDone(cleanDone);
      setNotes(cleanStrings(data.notes));
      setEvidence(cleanStrings(data.evidence));
      setTargets(cleanStrings(data.targets));
      flashMsg("importado");
    } catch {
      flashMsg("arquivo inválido");
    }
  };

  const setNote = (id: string, value: string) =>
    setNotes((prev) => ({ ...prev, [id]: value }));

  return (
    <div className="relative z-10 min-h-dvh">
      <header className="sticky top-0 z-20">
        <Glass
          className="rounded-none border-b border-white/[0.04]"
          style={
            {
              "--lg-glass": "rgba(38, 38, 35, 0.62)",
              "--lg-blur": "18px",
            } as CSSProperties
          }
        >
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Route className="size-4" />
              </span>
              <div className="min-w-0 leading-tight">
                <div className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  roadmap
                </div>
                <div className="hidden truncate text-[12.5px] text-foreground/80 sm:block">
                  estagiário .NET para júnior com IA aplicada
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 22,
                    }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  <NumberTicker
                    value={doneCount}
                    pad={1}
                    startOnView={false}
                    className="text-foreground"
                  />
                  /{total}
                </span>
              </div>
              {flash && (
                <span className="hidden font-mono text-[10px] text-primary sm:inline">
                  {flash}
                </span>
              )}
              <Menu
                aria-label="Ações do roadmap"
                align="end"
                items={[
                  {
                    label: "Copiar resumo",
                    icon: <Copy className="size-4" />,
                    onSelect: copySummary,
                  },
                  {
                    label: "Exportar JSON",
                    icon: <Download className="size-4" />,
                    onSelect: exportProgress,
                  },
                  {
                    label: "Importar JSON",
                    icon: <Upload className="size-4" />,
                    onSelect: () => fileRef.current?.click(),
                  },
                  "separator",
                  {
                    label: "Limpar tudo",
                    icon: <RotateCcw className="size-4" />,
                    onSelect: reset,
                    destructive: true,
                  },
                ]}
              />
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importProgress(file);
                  event.currentTarget.value = "";
                }}
              />
            </div>
          </div>
        </Glass>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24">
        {/* hero */}
        <section className="pt-14 pb-10 sm:pt-20">
          <div className="mb-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            Trilha Nível A
          </div>

          <h1 className="max-w-3xl text-balance font-serif text-[34px] leading-[1.05] font-medium tracking-[-0.02em] sm:text-[52px]">
            Do zero ao julgamento próprio
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Quatro etapas com certificação que o mercado reconhece, um artefato
            por etapa e um critério de saída que não depende de opinião. Ordem
            por dependência, não por tempo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Tag kind="pre" />
            <Tag kind="cert" />
            <Tag kind="art" />
            <Tag kind="opt" />
            <span className="ml-1 font-mono text-[11px] text-muted-foreground">
              o progresso fica salvo neste navegador
            </span>
          </div>
        </section>

        {/* tabs */}
        <div className="flex">
          <TabBar
            items={tabItems}
            value={tab}
            onValueChange={(value) => {
              setTab(value);
              history.replaceState(null, "", `#${value}`);
            }}
            aria-label="Seções do roadmap"
            style={
              {
                "--lg-glass": "rgba(43, 42, 39, 0.55)",
                "--lg-glass-active": "rgba(61, 59, 55, 0.9)",
                "--lg-foreground": "#f3f1ea",
              } as CSSProperties
            }
          />
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* ---------------------------------------------------- trilha */}
          {tab === "trilha" && (
            <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center gap-4 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-3.5" />
                doc oficial
              </span>
              <span className="flex items-center gap-1.5 text-primary/70">
                <GraduationCap className="size-3.5" />
                curso ou guia
              </span>
            </div>

            <Card
              size="compact"
              className="mb-6 border-primary/25 bg-primary/[0.04]"
            >
              <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                    Próximo passo
                  </div>
                  {nextStep ? (
                    <>
                      <div className="mt-1 text-[14px] font-medium">
                        {nextStep.stage.step} · {nextStep.stage.title}
                      </div>
                      <div className="text-[13px] text-muted-foreground">
                        {nextStep.item.label}
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 text-[14px] font-medium">
                      Trilha concluída. Agora é prática no trabalho.
                    </div>
                  )}
                </div>
                {nextStep && (
                  <a
                    href={`#${nextStep.stage.id}`}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-lg border border-primary/30 bg-primary/10 px-3 text-[12px] text-primary transition-colors hover:bg-primary/15 sm:self-auto"
                  >
                    Ir para a etapa
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </CardContent>
            </Card>

            <div className="mb-6">
              <BouncyAccordion
                defaultValue="ordem"
                items={[
                  {
                    id: "ordem",
                    title: "Por que essa ordem",
                    description:
                      "AI-901 e AI-103 são exames de Azure com Python e Microsoft Foundry. AZ-204 valida o seu stack real e só entra se a empresa for Azure. A ponte de Python existe porque é o único pré-requisito que você não tem hoje.",
                    icon: <Compass className="size-4" />,
                  },
                  {
                    id: "uso",
                    title: "Como usar sem prazo",
                    description:
                      "Marque só o que você conseguiu provar. Um item marcado significa que o artefato existe ou que o exame foi feito, não que você leu sobre o assunto.",
                    icon: <Terminal className="size-4" />,
                  },
                ]}
              />
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute top-3 bottom-8 left-[11px] w-px bg-gradient-to-b from-primary/50 via-border to-border sm:left-[13px]"
              />

              <ol className="space-y-5">
                {stages.map((stage) => {
                  const stageDone = stage.items.every((i) => done[i.id]);
                  const stageDoneCount = stage.items.filter(
                    (i) => done[i.id],
                  ).length;
                  const stagePct = Math.round(
                    (stageDoneCount / stage.items.length) * 100,
                  );
                  return (
                    <li
                      key={stage.id}
                      id={stage.id}
                      className="relative scroll-mt-24 pl-9 sm:pl-11"
                    >
                      <span
                        className={cn(
                          "absolute top-5 left-0 grid size-6 place-items-center rounded-full border bg-card transition-colors",
                          stageDone
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {stageDone ? (
                          <Check className="size-3.5" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </span>

                      <Card
                        className={cn(
                          "transition-colors",
                          stageDone && "border-primary/30",
                        )}
                      >
                        <CardHeader>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 font-mono text-[10.5px] tracking-[0.16em] text-muted-foreground uppercase">
                              {stage.step}
                            </div>
                            <CardTitle className="text-[17px] leading-snug">
                              {stage.title}
                            </CardTitle>
                          </div>
                          <CardAction className="flex flex-wrap items-center gap-1.5">
                            <Tag kind={stage.kind} />
                            <AnimatedBadge
                              size="sm"
                              status={stageDone ? "success" : "neutral"}
                              contentKey={stageDone ? "done" : "pending"}
                              pulse={stageDone}
                              className={
                                stageDone
                                  ? "border-primary/30 bg-primary/10 text-primary"
                                  : undefined
                              }
                            >
                              {stageDone ? "Concluído" : "Pendente"}
                            </AnimatedBadge>
                          </CardAction>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-1.5">
                            {stage.meta.map((m) => (
                              <Meta key={m}>{m}</Meta>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {stage.links.map((link) => (
                              <ExtLinkChip key={link.href} link={link} />
                            ))}
                          </div>

                          <p className="max-w-3xl text-[13.5px] leading-relaxed text-muted-foreground">
                            {stage.why}
                          </p>

                          <details className="group rounded-xl border border-border/70 bg-muted/20">
                            <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground">
                              <BookOpen className="size-3.5 text-primary" />
                              Como estudar
                              <ChevronDown className="ml-auto size-3.5 transition-transform group-open:rotate-180" />
                            </summary>
                            <ul className="space-y-2 border-t border-border/60 px-3.5 py-3">
                              {stage.guide.map((tip) => (
                                <li
                                  key={tip}
                                  className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground"
                                >
                                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/70" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </details>

                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {stage.items.map((item) => (
                              <div key={item.id} className="min-w-0">
                                <div className="flex items-start gap-2">
                                  <Checkbox
                                    id={item.id}
                                    label={item.label}
                                    className="min-w-0 flex-1"
                                    checked={!!done[item.id]}
                                    onCheckedChange={(v) => toggle(item.id, v)}
                                  />
                                  <div className="flex shrink-0 items-center gap-0.5">
                                    {item.href && (
                                      <StudyLink
                                        href={item.href}
                                        label={item.label}
                                      />
                                    )}
                                    {item.course && (
                                      <StudyLink
                                        href={item.course}
                                        label={item.label}
                                        kind="course"
                                      />
                                    )}
                                  </div>
                                </div>
                                {done[item.id] && (
                                  <input
                                    value={evidence[item.id] ?? ""}
                                    onChange={(event) =>
                                      setEvidence((prev) => ({
                                        ...prev,
                                        [item.id]: event.target.value,
                                      }))
                                    }
                                    placeholder="evidência: link ou nota"
                                    aria-label={`Evidência de ${item.label}`}
                                    className="mt-1.5 ml-8 h-7 w-[calc(100%-2rem)] rounded-md border border-border/70 bg-background/30 px-2 font-mono text-[10.5px] text-foreground/80 placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {(stage.artifact || stage.goal || stage.caveat) && (
                            <div className="grid gap-2.5">
                              {stage.artifact && (
                                <Note label="Artefato">{stage.artifact}</Note>
                              )}
                              {stage.goal && (
                                <Note label="Critério de saída">
                                  {stage.goal}
                                </Note>
                              )}
                              {stage.caveat && (
                                <Note label="Atenção" tone="muted">
                                  {stage.caveat}
                                </Note>
                              )}
                            </div>
                          )}

                          <details className="group">
                            <summary className="flex cursor-pointer list-none items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                              <StickyNote className="size-3.5" />
                              Anotações
                              {notes[stage.id]?.trim() ? (
                                <span className="font-mono text-[10px] text-primary">
                                  preenchidas
                                </span>
                              ) : null}
                            </summary>
                            <textarea
                              value={notes[stage.id] ?? ""}
                              onChange={(event) =>
                                setNote(stage.id, event.target.value)
                              }
                              placeholder="O que travou, o que funcionou, link do repositório, nota do Practice Assessment..."
                              className="mt-2 min-h-24 w-full resize-y rounded-xl border border-border bg-background/40 p-3 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none"
                            />
                          </details>

                          <div className="flex items-center gap-2">
                            <CalendarDays className="size-3.5 text-muted-foreground" />
                            <input
                              type="date"
                              value={targets[stage.id] ?? ""}
                              onChange={(event) =>
                                setTargets((prev) => ({
                                  ...prev,
                                  [stage.id]: event.target.value,
                                }))
                              }
                              aria-label={`Data-alvo da ${stage.step}`}
                              className="h-6 rounded-md border border-border/60 bg-background/30 px-1.5 font-mono text-[10px] text-foreground/75"
                            />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              meta opcional
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-3 border-t border-border/50 pt-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={false}
                                animate={{ width: `${stagePct}%` }}
                                transition={{
                                  type: "spring",
                                  stiffness: 140,
                                  damping: 22,
                                }}
                              />
                            </div>
                            <span className="font-mono text-[10.5px] text-muted-foreground">
                              {stageDoneCount}/{stage.items.length}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ol>
            </div>
            </div>
          )}

          {/* ---------------------------------------------------- extras */}
          {tab === "extras" && (
            <div className="mt-8">
            <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
              Nenhum destes substitui exame, mas todos custam pouco ou nada e
              encurtam o caminho.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {extras.map((extra) => {
                const Icon = extra.icon;
                return (
                  <Card key={extra.id} size="compact">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-foreground/80">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-[15px]">
                            {extra.title}
                          </CardTitle>
                          <CardDescription className="mt-1 text-[13px] leading-relaxed">
                            {extra.body}
                          </CardDescription>
                        </div>
                        <a
                          href={extra.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Abrir ${extra.title}`}
                          className="grid size-7 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Checkbox
                        id={extra.id}
                        label={extra.check}
                        checked={!!done[extra.id]}
                        onCheckedChange={(v) => toggle(extra.id, v)}
                      />
                    </CardContent>
                  </Card>
                );
              })}

              <Card size="compact" className="sm:col-span-2">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-foreground/80">
                      <Wallet className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-[15px]">
                        Custo e limpeza no Azure
                      </CardTitle>
                      <CardDescription className="mt-1 text-[13px] leading-relaxed">
                        Recurso esquecido é a forma mais comum de transformar
                        estudo em cobrança.
                      </CardDescription>
                    </div>
                    <a
                      href="https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Abrir tutorial de orçamento no Azure"
                      className="grid size-7 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2.5 sm:grid-cols-3">
                  {costItems.map((cost) => (
                    <div key={cost.id} className="flex items-start gap-2">
                      <Checkbox
                        id={cost.id}
                        label={cost.label}
                        className="min-w-0 flex-1"
                        checked={!!done[cost.id]}
                        onCheckedChange={(v) => toggle(cost.id, v)}
                      />
                      {cost.href && (
                        <StudyLink href={cost.href} label={cost.label} />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {/* --------------------------------------------------- leitura */}
          {tab === "leitura" && (
            <div className="mt-8">
            <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
              Ordem de retorno, não de prestígio. Livro é o que fica quando o
              curso acaba.
            </p>

            <Card className="overflow-hidden">
              <ul className="divide-y divide-border/70">
                {books.map((book, index) => (
                  <li
                    key={book.id}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[24px_1.2fr_1.4fr_auto] sm:items-start sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <Checkbox
                        id={book.id}
                        aria-label={`Lido: ${book.title}`}
                        checked={!!done[book.id]}
                        onCheckedChange={(v) => toggle(book.id, v)}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground/70 sm:hidden">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0">
                      {book.href ? (
                        <a
                          href={book.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 text-[14.5px] font-medium tracking-[-0.01em] transition-colors hover:text-primary"
                        >
                          {book.title}
                          <ArrowUpRight className="size-3 opacity-40 transition-opacity group-hover:opacity-100" />
                        </a>
                      ) : (
                        <div className="text-[14.5px] font-medium tracking-[-0.01em]">
                          {book.title}
                        </div>
                      )}
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {book.author}
                      </div>
                    </div>

                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {book.why}
                    </p>

                    <span className="justify-self-start rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[10.5px] whitespace-nowrap text-muted-foreground sm:justify-self-end">
                      {book.when}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            </div>
          )}

          {/* ---------------------------------------------------- prática */}
          {tab === "pratica" && (
            <div className="mt-8">
            <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
              Certificação abre porta. Isto é o que faz alguém confiar em você
              com um problema em produção.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {practice.map((item) => (
                <Card key={item.id} size="compact" className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                    <h3 className="text-[14.5px] font-medium tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id={item.id}
                        label={item.check}
                        className="min-w-0 flex-1"
                        checked={!!done[item.id]}
                        onCheckedChange={(v) => toggle(item.id, v)}
                      />
                      {item.href && (
                        <StudyLink
                          href={item.href}
                          label={item.check}
                          kind="course"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-medium">
                  <ShieldCheck className="size-4 text-primary" />
                  Armadilhas
                </h3>
                <BouncyAccordion items={traps} collapsible />
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-medium">
                  <Terminal className="size-4 text-primary" />
                  Teste de seis meses
                </h3>
                <Card size="compact">
                  <CardContent className="pt-5">
                    <p className="mb-4 text-[13px] text-muted-foreground">
                      Se as quatro respostas forem sim, você não está perdendo
                      oportunidades.
                    </p>
                    <ol className="space-y-3">
                      {testQuestions.map((question, index) => (
                        <li
                          key={question}
                          className="flex items-start gap-3 text-[13.5px] leading-relaxed"
                        >
                          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 font-mono text-[11px] text-primary">
                            {index + 1}
                          </span>
                          {question}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
            </div>
          )}
        </motion.div>

        <footer className="mt-16 flex flex-col gap-3 border-t border-border/70 pt-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Progresso local. Exporte um JSON pelo menu para não perder.
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            fontes: Microsoft Learn · AI-901 · AI-103
            <ArrowUpRight className="size-3" />
          </span>
        </footer>
      </main>
    </div>
  );
}
