import { readFile, writeFile } from "node:fs/promises";

const playersDoc = JSON.parse(await readFile("data/players.json", "utf8"));
const matchesDoc = JSON.parse(await readFile("data/matches.json", "utf8"));
if (playersDoc.version !== 1 || matchesDoc.version !== 1) {
  throw new Error("Unsupported ChessLink data version");
}
const players = new Map();
for (const p of playersDoc.players ?? []) {
  if (!p.id || typeof p.id !== "string" || typeof p.name !== "string") continue;
  players.set(p.id, { id: p.id, name: p.name.slice(0, 24), rating: 1200, games: 0, wins: 0, draws: 0, losses: 0 });
}
const seen = new Set();
const expected = (a, b) => 1 / (1 + 10 ** ((b - a) / 400));
const K = 24;
for (const m of matchesDoc.matches ?? []) {
  if (!m.id || seen.has(m.id) || !players.has(m.whiteId) || !players.has(m.blackId)) continue;
  if (!["1-0", "0-1", "1/2-1/2"].includes(m.result)) continue;
  seen.add(m.id);
  const w = players.get(m.whiteId), b = players.get(m.blackId);
  const scoreW = m.result === "1-0" ? 1 : m.result === "0-1" ? 0 : 0.5;
  const scoreB = 1 - scoreW;
  const oldW = w.rating, oldB = b.rating;
  w.rating = Math.round(oldW + K * (scoreW - expected(oldW, oldB)));
  b.rating = Math.round(oldB + K * (scoreB - expected(oldB, oldW)));
  w.games++; b.games++;
  if (scoreW === 1) { w.wins++; b.losses++; }
  else if (scoreW === 0) { b.wins++; w.losses++; }
  else { w.draws++; b.draws++; }
}
const ranked = [...players.values()].sort((a, b) => b.rating - a.rating || b.wins - a.wins || a.name.localeCompare(b.name));
await writeFile("data/leaderboard.json", JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), players: ranked }, null, 2) + "\n");
console.log(`Generated leaderboard for ${ranked.length} players from ${seen.size} valid match records.`);
