// Robot de noticias — Ley Anticapuchos al Día (Vibras Positivas HM)
// Corre en GitHub Actions cada 30 minutos. Trae noticias y videos reales y actuales
// del proyecto Anticapuchos y del representante Jaime Arizabaleta, con su foto real
// (og:image del medio o miniatura del video), y guarda data/noticias.json.
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data/noticias.json", import.meta.url);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const CONSULTAS = [
  { q: '"Ley Anticapuchos"', tema: "proyecto" },
  { q: '"ley anti capuchos"', tema: "proyecto" },
  { q: 'encapuchados protestas proyecto de ley Cámara Colombia', tema: "proyecto" },
  { q: '"Jaime Arizabaleta"', tema: "arizabaleta" },
  { q: 'Arizabaleta representante Cámara', tema: "arizabaleta" }
];
const VIDEOS_Q = ["Ley Anticapuchos", "Jaime Arizabaleta representante", "Arizabaleta ley anticapuchos"];

const decode = s => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ""; };
const key = s => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").slice(0, 60);
const relevante = (t, tema) => tema === "arizabaleta" ? /arizabaleta/i.test(t) : /capuch|encapuchad/i.test(t);

async function noticias(q, tema) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}+when:120d&hl=es-419&gl=CO&ceid=CO:es-419`;
  const xml = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const titulo = tag(it, "title");
    return {
      titulo: titulo.replace(/ - [^-]+$/, ""),
      medio: tag(it, "source") || titulo.split(" - ").pop(),
      fecha: new Date(tag(it, "pubDate")).toISOString(),
      url: tag(it, "link"),
      imagen: "",
      tema
    };
  }).filter(n => relevante(n.titulo, tema));
}

async function fotoReal(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(9000) });
    let html = (await r.text()).slice(0, 250000);
    // Google Noticias a veces entrega una página intermedia: seguir el enlace real
    const real = html.match(/data-n-au="([^"]+)"/) || html.match(/<a[^>]+href="(https?:\/\/(?!news\.google)[^"]+)"/);
    if (/news\.google/.test(r.url) && real) {
      const r2 = await fetch(decode(real[1]), { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(9000) });
      html = (await r2.text()).slice(0, 250000);
    }
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)/i);
    const u = m ? decode(m[1]) : "";
    return /googleusercontent|gstatic|logo|placeholder/i.test(u) ? "" : u;
  } catch { return ""; }
}

// Videos reales y recientes de YouTube (sin API key: se lee la página de resultados)
async function videos(q) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=CAI%253D`; // orden: más recientes
    const html = await (await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es-CO,es;q=0.9" } })).text();
    const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!m) return [];
    const out = [];
    const walk = o => {
      if (!o || typeof o !== "object") return;
      if (o.videoRenderer) {
        const v = o.videoRenderer;
        out.push({
          id: v.videoId,
          titulo: v.title?.runs?.map(r => r.text).join("") || "",
          canal: v.ownerText?.runs?.[0]?.text || "",
          hace: v.publishedTimeText?.simpleText || "",
          imagen: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
        });
        return;
      }
      for (const k in o) walk(o[k]);
    };
    walk(JSON.parse(m[1]));
    return out.filter(v => /capuch|arizabaleta/i.test(v.titulo));
  } catch (e) { console.log("YouTube:", e.message); return []; }
}

const prev = JSON.parse(await readFile(FILE, "utf8"));
const mapa = new Map((prev.noticias || []).map(n => [key(n.titulo), n]));
for (const { q, tema } of CONSULTAS) {
  try { for (const n of await noticias(q, tema)) if (!mapa.has(key(n.titulo))) mapa.set(key(n.titulo), n); }
  catch (e) { console.log("Falló consulta", q, e.message); }
}
const lista = [...mapa.values()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 100);
let revisadas = 0;
for (const n of lista) if (!n.imagen && revisadas < 30) { n.imagen = await fotoReal(n.url); revisadas++; }

const vmap = new Map((prev.videos || []).map(v => [v.id, v]));
for (const q of VIDEOS_Q) for (const v of await videos(q)) vmap.set(v.id, { ...vmap.get(v.id), ...v, visto: vmap.get(v.id)?.visto || new Date().toISOString() });
const listaVideos = [...vmap.values()].sort((a, b) => new Date(b.visto) - new Date(a.visto)).slice(0, 24);

// Fotos actuales para la portada: las de las noticias más recientes
const fotos = lista.filter(n => n.imagen).slice(0, 8).map(n => ({ src: n.imagen, medio: n.medio, url: n.url }));

const ahora = new Date().toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T") + "-05:00";
await writeFile(FILE, JSON.stringify({ actualizado: ahora, fuente: "Google Noticias y YouTube (robot cada 30 min)", fotos, videos: listaVideos, noticias: lista }, null, 2) + "\n");
console.log(`Listo ${ahora}: ${lista.length} noticias, ${fotos.length} fotos, ${listaVideos.length} videos`);
