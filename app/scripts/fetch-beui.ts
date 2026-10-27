const slugs = [
  "card",
  "checkbox",
  "tabs",
  "animated-badge",
  "number",
  "bouncy-accordion",
  "button",
];

const root = new URL("../", import.meta.url);

for (const slug of slugs) {
  const res = await fetch(`https://beui.dev/r/${slug}`);
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const entry = (await res.json()) as {
    slug: string;
    files: { path: string; type: string; content: string }[];
  };

  for (const file of entry.files) {
    if (file.type === "preview") continue;
    const rel = file.path.startsWith("src/") ? file.path : `src/${file.path}`;
    const target = new URL(rel, root);
    await Bun.write(target, file.content);
    console.log(`${slug}: ${rel}`);
  }
}

console.log("done");
