import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);
const ENTRYPOINT_PATTERN =
  /[\\/]app[\\/](?:.*[\\/])?(?:page|layout|route|loading|error|global-error|not-found|template|default)\.(?:ts|tsx)$/;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function sourceFiles() {
  return walk(SRC).filter((file) => SOURCE_EXTENSIONS.has(path.extname(file)));
}

function normalize(file) {
  return path.relative(ROOT, file).replaceAll("\\", "/");
}

function resolveModule(fromFile, specifier, files) {
  let candidate;

  if (specifier.startsWith("@/")) {
    candidate = path.join(SRC, specifier.slice(2));
  } else if (specifier.startsWith("@domain/")) {
    candidate = path.join(SRC, "domain", specifier.slice("@domain/".length));
  } else if (specifier.startsWith("@application/")) {
    candidate = path.join(SRC, "application", specifier.slice("@application/".length));
  } else if (specifier.startsWith("@infra/")) {
    candidate = path.join(SRC, "infrastructure", specifier.slice("@infra/".length));
  } else if (specifier.startsWith(".")) {
    candidate = path.resolve(path.dirname(fromFile), specifier);
  } else {
    return null;
  }

  const attempts = [
    candidate,
    ...[...SOURCE_EXTENSIONS].map((extension) => `${candidate}${extension}`),
    ...[...SOURCE_EXTENSIONS].map((extension) => path.join(candidate, `index${extension}`)),
  ].map(path.normalize);

  return attempts.find((attempt) => files.has(attempt)) ?? null;
}

function importsOf(file, files) {
  const text = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = [];

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      imports.push(node.moduleSpecifier.text);
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports
    .map((specifier) => ({ specifier, target: resolveModule(file, specifier, files) }))
    .filter(({ target }) => target !== null);
}

function layerOf(file) {
  const relative = normalize(file);
  const match = relative.match(/^src\/([^/]+)/);
  return match?.[1] ?? "unknown";
}

const files = new Set(sourceFiles().map(path.normalize));
const graph = new Map(
  [...files].map((file) => [file, importsOf(file, files).map(({ target }) => target)]),
);
const entrypoints = [...files].filter((file) => ENTRYPOINT_PATTERN.test(file));
const reachable = new Set();
const queue = [...entrypoints];

while (queue.length > 0) {
  const current = queue.pop();
  if (!current || reachable.has(current)) continue;
  reachable.add(current);
  queue.push(...(graph.get(current) ?? []));
}

const allowedDependencies = {
  app: new Set(["app", "presentation", "infrastructure", "application", "domain"]),
  domain: new Set(["domain"]),
  application: new Set(["application", "domain"]),
  infrastructure: new Set(["infrastructure", "application", "domain"]),
  presentation: new Set(["presentation", "application", "domain"]),
};

const violations = [];
for (const [source, targets] of graph) {
  const sourceLayer = layerOf(source);
  const allowed = allowedDependencies[sourceLayer];
  if (!allowed) continue;

  for (const target of targets) {
    const targetLayer = layerOf(target);
    if (!allowed.has(targetLayer)) {
      violations.push(`${normalize(source)} -> ${normalize(target)}`);
    }
  }
}

const orphans = [...files]
  .filter((file) => !reachable.has(file))
  .map(normalize)
  .sort();

console.log("Architecture audit");
console.log(`Entrypoints: ${entrypoints.length}`);
console.log(`Source files: ${files.size}`);
console.log(`Reachable files: ${reachable.size}`);
console.log("\nLayer violations:");
console.log(violations.length > 0 ? violations.sort().join("\n") : "none");
console.log("\nUnreachable source files:");
console.log(orphans.length > 0 ? orphans.join("\n") : "none");

const expectedSourceRoots = new Set([
  "app",
  "application",
  "domain",
  "infrastructure",
  "presentation",
  "styles",
]);
const unexpectedSourceRoots = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !expectedSourceRoots.has(entry.name))
  .map((entry) => `src/${entry.name}`)
  .sort();

console.log("\nUnexpected source roots:");
console.log(
  unexpectedSourceRoots.length > 0 ? unexpectedSourceRoots.join("\n") : "none",
);

const referenceFiles = [
  ...walk(SRC).filter((file) => /\.(?:css|ts|tsx|mts|cts)$/.test(file)),
  path.join(ROOT, "next.config.ts"),
];
const referenceText = referenceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const publicFiles = walk(PUBLIC).filter((file) => fs.statSync(file).isFile());
const unreferencedPublicFiles = publicFiles
  .filter((file) => {
    const publicPath = `/${path.relative(PUBLIC, file).replaceAll("\\", "/")}`;
    return !referenceText.includes(publicPath);
  })
  .map(normalize)
  .sort();

console.log("\nUnreferenced public files:");
console.log(
  unreferencedPublicFiles.length > 0 ? unreferencedPublicFiles.join("\n") : "none",
);

const manifestFile = path.join(
  SRC,
  "infrastructure",
  "media",
  "manifest",
  "media-manifest.ts",
);
if (fs.existsSync(manifestFile)) {
  const manifestText = fs.readFileSync(manifestFile, "utf8");
  const registeredKeys = [
    ...manifestText.matchAll(/\[mediaKey\("([^"]+)"\)\]/g),
  ].map((match) => match[1]);
  const consumersText = referenceFiles
    .filter((file) => path.normalize(file) !== path.normalize(manifestFile))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  const unusedKeys = registeredKeys
    .filter((key) => !consumersText.includes(`mediaKey("${key}")`))
    .sort();

  console.log("\nUnused media manifest keys:");
  console.log(unusedKeys.length > 0 ? unusedKeys.join("\n") : "none");
}
