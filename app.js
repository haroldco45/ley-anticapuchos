/* Ley Anticapuchos al Día — Vibras Positivas HM */
(() => {
  const C = window.CONTENIDO;
  const A = C.ARIZABALETA;
  const TZ = "America/Bogota";
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  /* ---------- Idioma ---------- */
  const T = {
    es: {
      buscar: "Buscar en las noticias…", en_vivo: "Buscando en vivo…", vivo_ok: "En vivo · {n} nuevas",
      vivo_off: "Resultados del robot", sin_hoy: "Hoy no hay noticias nuevas. Esto es lo más reciente:",
      nuevas: "{n} noticias desde su última visita", robot: "Robot: {f}", copiado: "Texto copiado",
      leer: "Leer en el medio", actualizado: "Actualizado {f}", estado: "Estado del trámite",
      foto_de: "Foto: {m}", foto_archivo: "Foto de archivo: Wikimedia Commons", ver: "Ver video",
      sin_videos: "El robot está buscando los videos más recientes. Mientras tanto, este es un registro real de las protestas de 2021:",
      sin_ari: "El robot está reuniendo las noticias más recientes sobre el representante."
    },
    en: {
      al_dia: "Tracker", nav_hoy: "Today", nav_propone: "The bill", nav_tramite: "Progress", nav_debate: "Debate", nav_videos: "Videos",
      nav_noticias: "News", nav_peticion: "Petition", actualizar: "Refresh", seguimiento: "Live citizen tracker",
      hero_t: "Prison for covering your face to commit vandalism at a protest?",
      hero_p: "The Anti-Hood Bill, by Representative Jaime Arizabaleta and other lawmakers, creates a new crime and raises penalties for blocking roads. Follow the bill and its author here, day by day.",
      kpi_meses: "months in prison", kpi_smmlv: "minimum wages in fines", kpi_debates: "debates passed", kpi_dias: "days since filing",
      hora_col: "Colombia time", hoy_ey: "Latest", hoy_t: "Today", hoy_sub: "Updates every time you open it.",
      ari_ey: "Following the author", ari_sub: "What he does, what he proposes and what the media say. Public information, checked against sources.",
      ari_proy: "His bills", ari_hechos: "What he has done", ari_medios: "Arizabaleta in the news",
      prop_ey: "The text", prop_t: "What it proposes, article by article", prop_sub: "Based on the bill text published by Centro Democrático (July 20, 2026).",
      calc_t: "How much would the fine be in pesos?", calc_sub: "Using the 2026 minimum wage: COP 1,750,905 (Decree 1469 of 2025).", smmlv: "minimum wages",
      hoy_353a: "Today (art. 353A, road blocking)", prop_353a: "With the bill", meses: "months",
      tram_ey: "The path", tram_t: "Where it stands", tram_sub: "A bill needs four debates: House First Committee and floor, Senate First Committee and floor. Then the President signs.",
      deb_ey: "The positions", deb_t: "For and against", deb_sub: "What supporters and critics say. You decide.", pro_t: "For", con_t: "Against or with concerns",
      cortes_t: "What the Constitutional Court has said (cited in the bill)",
      vid_ey: "On video", vid_t: "Recent videos", vid_sub: "The robot searches YouTube for the newest videos about the bill and Arizabaleta.",
      not_ey: "All the news", not_t: "Real news", not_sub: "The robot fetches them every 30 minutes and the app searches live on open.",
      f_todo: "All", f_proy: "Bill",
      pet_ey: "Take part", pet_t: "Right of petition: let's demand answers", pet_sub: "Article 23 of the Constitution and Law 1755 of 2015. Fill it in once and send it to every agency at once.",
      f_nombre: "Full name", f_cedula: "ID number", f_ciudad: "City", f_correo: "Email for the reply", f_dest: "Sent to",
      enviar: "Send to all at once", copiar: "Copy text", whatsapp: "Share on WhatsApp",
      pet_nota: "Agencies have 15 business days to reply. Keep the sent email as proof. (The petition is in Spanish, as Colombian agencies require.)",
      fuentes: "Sources and credits", creditos: "News and video images belong to each linked outlet or channel. Backup photos from Wikimedia Commons: “Puerto Resistencia 05” by Remux (CC BY-SA 4.0) and “Avenida San Juan…, Medellín” (CC BY-SA 4.0).",
      pie: "Independent citizen app. Not affiliated with any party or agency.",
      buscar: "Search the news…", en_vivo: "Searching live…", vivo_ok: "Live · {n} new", vivo_off: "Robot results",
      sin_hoy: "No new stories today. Here is the latest:", nuevas: "{n} stories since your last visit",
      robot: "Robot: {f}", copiado: "Text copied", leer: "Read at the outlet", actualizado: "Updated {f}", estado: "Bill status",
      foto_de: "Photo: {m}", foto_archivo: "Archive photo: Wikimedia Commons", ver: "Watch",
      sin_videos: "The robot is fetching the latest videos. Meanwhile, here is real footage of the 2021 protests:",
      sin_ari: "The robot is gathering the latest news about the representative."
    }
  };
  let lang = store.get("lang") || "es";
  const ORIG = {};
  document.querySelectorAll("[data-i18n]").forEach(el => ORIG[el.dataset.i18n] = el.innerHTML);
  const t = (k, vars = {}) => {
    let s = (T[lang] && T[lang][k]) || T.es[k] || ORIG[k] || k;
    Object.entries(vars).forEach(([a, b]) => s = s.replace("{" + a + "}", b));
    return s;
  };
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.dataset.i18n;
      el.innerHTML = lang === "es" ? ORIG[k] : (T.en[k] || ORIG[k]);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    $("#btnLang").textContent = lang === "es" ? "EN" : "ES";
    renderStatic(); renderAll(); buildPetition();
  }
  $("#btnLang").onclick = () => { lang = lang === "es" ? "en" : "es"; store.set("lang", lang); applyLang(); };

  /* ---------- Fechas en hora de Colombia ---------- */
  const fmt = (d, opt) => new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", { timeZone: TZ, ...opt }).format(new Date(d));
  const fFecha = (d) => d.length <= 7 ? fmt(d + "-15T12:00:00-05:00", { month: "long", year: "numeric" }) : fmt(d + "T12:00:00-05:00", { day: "numeric", month: "short", year: "numeric" });
  const fHora = (d) => fmt(d, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const diaCol = (d) => fmt(d, { year: "numeric", month: "2-digit", day: "2-digit" });
  function tick() { $("#clock").textContent = fmt(Date.now(), { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit", second: "2-digit" }); }
  setInterval(tick, 1000); tick();

  const esc = (s) => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cop = (n) => "$" + Math.round(n).toLocaleString("es-CO");

  /* ---------- Contenido fijo ---------- */
  function renderStatic() {
    $("#kpiDebates").textContent = `${C.DEBATES_APROBADOS} / 4`;
    $("#kpiDias").textContent = Math.floor((Date.now() - new Date(C.RADICADO)) / 864e5);
    $("#articulos").innerHTML = C.ARTICULOS.map(a => `<li><span class="n">${a.n}</span><div><b>${a[lang][0]}</b><p>${a[lang][1]}</p></div></li>`).join("")
      + `<li class="note"><p>${C.NOTA_PENAS[lang]}</p></li>`;
    $("#road").innerHTML = C.ROAD.map((r, i) => `<div class="step ${r.done ? "done" : ""} ${r.now ? "now" : ""}"><i>${i + 1}</i><span>${r[lang]}</span></div>`).join("");
    $("#timeline").innerHTML = C.TIMELINE.slice().reverse().map(e => `<li><time>${fFecha(e.f)}</time><p>${e[lang]}</p></li>`).join("");
    $("#proList").innerHTML = C.PRO.map(p => `<li>${p[lang]}</li>`).join("");
    $("#conList").innerHTML = C.CON.map(p => `<li>${p[lang]}</li>`).join("");
    $("#cortes").innerHTML = C.CORTES.map(c => `<div class="chip"><b>${c.s}</b><span>${c[lang]}</span></div>`).join("");
    $("#fuentes").innerHTML = C.FUENTES.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join("");
    $("#destinos").innerHTML = C.DESTINOS.map(d => `<label class="d"><input type="checkbox" checked value="${d.m}"> <span>${d.n}<small>${d.m}</small></span></label>`).join("");
    $("#destinos").onchange = buildPetition;
    // Arizabaleta
    $("#ariPerfil").innerHTML = A.perfil.map(p => `<div><dt>${p.k[lang]}</dt><dd>${p.v[lang]}</dd></div>`).join("");
    $("#ariProy").innerHTML = A.proyectos.map(p => `<article><b>${p.t}</b><p>${p[lang]}</p></article>`).join("");
    $("#ariHechos").innerHTML = A.hechos.map(h => `<li><time>${fFecha(h.f)}</time><p>${h[lang]}</p></li>`).join("");
    $("#ariLinks").innerHTML = A.enlaces.map(([n, u]) => `<a class="btn line" href="${u}" target="_blank" rel="noopener">${n}</a>`).join("");
  }
  const range = $("#smmlvRange");
  range.oninput = () => { $("#smmlvN").textContent = range.value; $("#smmlvCOP").textContent = cop(range.value * C.SMMLV_2026); };
  range.oninput();

  /* ---------- Datos vivos ---------- */
  const RESPALDO = [
    { src: "https://commons.wikimedia.org/wiki/Special:FilePath/Puerto_Resistencia_05.jpg?width=1600", medio: "" },
    { src: "https://commons.wikimedia.org/wiki/Special:FilePath/Avenida_San_Juan_en_las_manifestaciones_del_28_de_abril_de_2021,_Medell%C3%ADn.jpg?width=1600", medio: "" }
  ];
  let NEWS = [], VIDEOS = [], FOTOS = [], robotAt = null, filtro = "todo";
  const key = (s) => String(s).toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").slice(0, 60);
  const temaDe = (titulo) => /arizabaleta/i.test(titulo) ? "arizabaleta" : "proyecto";
  function merge(list) {
    const seen = new Set(NEWS.map(n => key(n.titulo)));
    let added = 0;
    list.forEach(n => {
      if (!n.titulo || seen.has(key(n.titulo))) return;
      seen.add(key(n.titulo)); NEWS.push({ tema: temaDe(n.titulo), ...n }); added++;
    });
    NEWS.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return added;
  }
  const fallbackImg = (i) => RESPALDO[i % RESPALDO.length].src.replace("1600", "900");
  const card = (n, i) => `
    <a class="ncard ${i === 0 ? "lead" : ""}" href="${esc(n.url)}" target="_blank" rel="noopener" style="--d:${Math.min(i, 8) * 50}ms">
      <div class="img"><img loading="lazy" src="${esc(n.imagen || fallbackImg(i))}" onerror="this.onerror=null;this.src='${fallbackImg(i)}'" alt=""></div>
      <div class="body">
        <small>${esc(n.medio)} <span>${fHora(n.fecha)}</span></small>
        <h4>${esc(n.titulo)}</h4>
        <span class="go">${t("leer")}</span>
      </div>
    </a>`;

  function renderNews() {
    const q = key($("#q").value || "");
    let list = filtro === "todo" ? NEWS : NEWS.filter(n => n.tema === filtro);
    if (q) list = list.filter(n => key(n.titulo + n.medio).includes(q));
    $("#newsList").innerHTML = list.slice(0, 48).map(card).join("");
    $("#robotStamp").textContent = robotAt ? t("robot", { f: fHora(robotAt) }) : "";
  }
  function renderHoy() {
    const hoy = diaCol(Date.now());
    const deHoy = NEWS.filter(n => diaCol(n.fecha) === hoy);
    const last = store.get("lastVisit");
    const desde = last ? NEWS.filter(n => new Date(n.fecha) > new Date(last)).length : 0;
    $("#hoyStamp").textContent = t("actualizado", { f: fHora(Date.now()) });
    $("#hoyStatus").innerHTML = `<span class="label">${t("estado")}</span><p>${C.ESTADO[lang]}</p>${desde ? `<span class="badge">${t("nuevas", { n: desde })}</span>` : ""}`;
    $("#hoyList").innerHTML = deHoy.length ? deHoy.map(card).join("")
      : `<p class="muted span">${t("sin_hoy")}</p>` + NEWS.slice(0, 3).map(card).join("");
  }
  function renderAri() {
    const l = NEWS.filter(n => n.tema === "arizabaleta");
    $("#ariNews").innerHTML = l.length ? l.slice(0, 6).map(card).join("") : `<p class="muted span">${t("sin_ari")}</p>`;
  }
  function renderVideos() {
    const box = $("#videoList");
    if (!VIDEOS.length) {
      box.innerHTML = `<p class="muted span">${t("sin_videos")}</p>
        <div class="vcard wide"><video controls preload="none" playsinline poster="${RESPALDO[0].src}">
          <source src="https://commons.wikimedia.org/wiki/Special:FilePath/Paro_Nacional_Colombia.webm" type="video/webm"></video>
          <div class="body"><h4>Paro Nacional Colombia (2021)</h4><small>Oxi.Ap · Wikimedia Commons · CC BY 2.0</small></div></div>`;
      return;
    }
    box.innerHTML = VIDEOS.slice(0, 12).map(v => `
      <div class="vcard" data-id="${esc(v.id)}">
        <button class="vthumb" aria-label="${t("ver")}"><img loading="lazy" src="${esc(v.imagen)}" alt=""><span class="play">${t("ver")}</span></button>
        <div class="body"><h4>${esc(v.titulo)}</h4><small>${esc(v.canal)}${v.hace ? " · " + esc(v.hace) : ""}</small></div>
      </div>`).join("");
    box.querySelectorAll(".vcard").forEach(c => c.querySelector(".vthumb").onclick = () => {
      c.querySelector(".vthumb").outerHTML = `<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/${c.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="YouTube"></iframe></div>`;
    });
  }

  /* Portada con fotos actuales de las noticias */
  let slideIx = 0, slideTimer;
  function renderHero() {
    const fotos = (FOTOS.length ? FOTOS : NEWS.filter(n => n.imagen).slice(0, 8).map(n => ({ src: n.imagen, medio: n.medio })));
    const set = fotos.length ? fotos : RESPALDO;
    const box = $("#heroSlides");
    box.innerHTML = set.map((f, i) => `<div class="slide ${i === 0 ? "on" : ""}" style="background-image:url('${esc(f.src)}')" data-medio="${esc(f.medio)}"></div>`).join("");
    const credit = () => {
      const m = box.children[slideIx]?.dataset.medio;
      $("#heroCredit").textContent = m ? t("foto_de", { m }) : t("foto_archivo");
    };
    slideIx = 0; credit();
    clearInterval(slideTimer);
    if (set.length > 1) slideTimer = setInterval(() => {
      box.children[slideIx].classList.remove("on");
      slideIx = (slideIx + 1) % set.length;
      box.children[slideIx].classList.add("on"); credit();
    }, 6500);
  }

  function renderAll() { renderHero(); renderHoy(); renderAri(); renderVideos(); renderNews(); }

  $("#q").oninput = renderNews;
  $("#filtro").onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    filtro = b.dataset.f;
    $("#filtro").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    renderNews();
  };

  async function loadRobot() {
    try {
      const r = await fetch("data/noticias.json?t=" + Date.now(), { cache: "no-store" });
      const j = await r.json();
      robotAt = j.actualizado; FOTOS = j.fotos || []; VIDEOS = j.videos || [];
      merge(j.noticias || []);
    } catch {}
  }

  // Búsqueda en vivo al abrir (Google Noticias, últimas semanas)
  const rss = (q) => "https://news.google.com/rss/search?q=" + encodeURIComponent(q + " when:30d") + "&hl=es-419&gl=CO&ceid=CO:es-419";
  const QUERIES = ['"Ley Anticapuchos" OR "ley anti capuchos"', '"Jaime Arizabaleta"'];
  function parseRSS(xml) {
    const d = new DOMParser().parseFromString(xml, "text/xml");
    return [...d.querySelectorAll("item")].map(it => {
      const title = it.querySelector("title")?.textContent || "";
      return { titulo: title.replace(/ - [^-]+$/, ""), medio: it.querySelector("source")?.textContent || title.split(" - ").pop(),
        fecha: it.querySelector("pubDate")?.textContent, url: it.querySelector("link")?.textContent, imagen: "" };
    });
  }
  async function fetchFeed(url) {
    const tries = [
      async () => { const r = await fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(url)); const j = await r.json();
        if (j.status !== "ok") throw 0; return j.items.map(i => ({ titulo: i.title.replace(/ - [^-]+$/, ""), medio: i.author || i.title.split(" - ").pop(), fecha: i.pubDate.replace(" ", "T") + "Z", url: i.link, imagen: i.thumbnail || "" })); },
      async () => parseRSS(await (await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url))).text()),
      async () => parseRSS(await (await fetch("https://corsproxy.io/?url=" + encodeURIComponent(url))).text())
    ];
    for (const f of tries) { try { return await f(); } catch {} }
    throw new Error("sin acceso");
  }
  async function liveSearch() {
    const st = $("#liveState"); st.textContent = t("en_vivo"); st.className = "state live";
    let n = 0, ok = false;
    await Promise.all(QUERIES.map(async q => {
      try { n += merge((await fetchFeed(rss(q))).filter(x => /capuch|arizabaleta/i.test(x.titulo))); ok = true; } catch {}
    }));
    st.textContent = ok ? t("vivo_ok", { n }) : t("vivo_off");
    st.className = ok ? "state ok" : "state";
  }

  async function refresh(btn) {
    if (btn) btn.classList.add("busy");
    await loadRobot(); renderAll();
    await liveSearch(); renderHoy(); renderAri(); renderNews();
    if (btn) btn.classList.remove("busy");
  }
  $("#btnRefresh").onclick = (e) => {
    navigator.serviceWorker?.getRegistration().then(r => r && r.update());
    refresh(e.currentTarget);
  };

  /* ---------- Derecho de petición ---------- */
  const form = $("#petForm");
  function petText() {
    const f = Object.fromEntries(new FormData(form));
    const destinos = [...document.querySelectorAll("#destinos input:checked")].map(i => C.DESTINOS.find(d => d.m === i.value).n);
    const fecha = new Intl.DateTimeFormat("es-CO", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" }).format(new Date());
    return `${f.ciudad || "[Ciudad]"}, ${fecha}

Señores:
${destinos.map(d => "- " + d).join("\n")}

Asunto: Derecho de petición — trámite del proyecto de ley "Ley Anticapuchos" (ocultamiento de identidad en manifestaciones y modificación del artículo 353A del Código Penal).

Yo, ${f.nombre || "[Nombre]"}, identificado(a) con cédula de ciudadanía ${f.cedula || "[Cédula]"}, en ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política y regulado por la Ley 1755 de 2015, respetuosamente solicito que, cada entidad en lo de su competencia, informe:

1. El número de radicado del proyecto, la Gaceta del Congreso en la que fue publicado y los ponentes designados para primer debate.
2. El estado actual del trámite, la fecha prevista para su discusión en la Comisión Primera de la Cámara y las razones por las que no se ha debatido.
3. El texto de la ponencia para primer debate y las modificaciones propuestas frente al texto radicado, en especial sobre la pena de prisión (48 a 96 meses) y la multa (50 a 200 SMMLV).
4. Los conceptos emitidos o solicitados al Gobierno Nacional, al Consejo Superior de Política Criminal, a la Fiscalía General de la Nación y a la Defensoría del Pueblo.
5. Las cifras y estudios que sustentan la necesidad del nuevo tipo penal, y el análisis de impacto fiscal y penitenciario (artículo 7 de la Ley 819 de 2003).
6. Las garantías previstas para que la norma no se use para restringir o criminalizar la protesta pacífica (artículo 37 de la Constitución).

Si alguna entidad no es competente para responder parte de esta petición, le solicito darle traslado a la autoridad competente según el artículo 21 de la Ley 1755 de 2015.

Recibiré respuesta en el correo: ${f.correo || "[Correo]"}

Atentamente,

${f.nombre || "[Nombre]"}
C.C. ${f.cedula || "[Cédula]"}
${f.ciudad || "[Ciudad]"}`;
  }
  function buildPetition() { $("#petText").textContent = petText(); }
  form.oninput = buildPetition;
  form.onsubmit = (e) => {
    e.preventDefault();
    const to = [...document.querySelectorAll("#destinos input:checked")].map(i => i.value).join(",");
    const f = Object.fromEntries(new FormData(form));
    location.href = `mailto:${to}?cc=${encodeURIComponent(f.correo)}&subject=${encodeURIComponent("Derecho de petición — trámite del proyecto Ley Anticapuchos")}&body=${encodeURIComponent(petText())}`;
  };
  $("#btnCopy").onclick = async () => { try { await navigator.clipboard.writeText(petText()); $("#btnCopy").textContent = t("copiado"); } catch {} };
  $("#btnWa").onclick = () => window.open("https://wa.me/?text=" + encodeURIComponent("Exijamos saber en qué va la Ley Anticapuchos. Envíe su derecho de petición de una sola vez aquí: https://ley-anticapuchos.netlify.app/#peticion"), "_blank");

  /* ---------- Arranque ---------- */
  applyLang();
  refresh().then(() => store.set("lastVisit", new Date().toISOString()));
  setInterval(() => refresh(), 30 * 60 * 1000);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
})();
