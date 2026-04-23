import { useState, useEffect, useRef } from "react";

const CONFIG = {

  // ── Identità ────────────────────────────────────────────────────────
  name: "Gabriele",
  surname: "De Luca",
  role: "Software Engineer, Programmer",
  location: "Bari, Italia",
  availability: "Disponibile da subito",   // lascia "" per nascondere

  bio: `Neolaureato in Informatica e Tecnologie per la Produzione del Software presso l'Università degli Studi di Bari. Progetto sistemi distribuiti che integrano modelli di intelligenza artificiale — con attenzione a testing, 
  osservabilità e manutenibilità del codice.`,

  // ── Link ────────────────────────────────────────────────────────────
  email: "gabbodlc03@gmail.com",
  phone: "",
  linkedin: "https://www.linkedin.com/in/gabriele-de-luca-14057b2ba/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2fiVRvjcSI6Fxnvgw2fbHA%3D%3D",
  github: "https://github.com/gabdeluc",
  website: "",

  // ── Chi sono (array di paragrafi — ognuno diventa un blocco) ───────
  about: [
    "Ho sviluppato la mia tesi nell'ambito del progetto ARIANNA (ARtIficiAl iNtelligeNce for virtuAl meetings), un sistema di videoconferenza AI-powered finanziato dal Bando Regionale Reti della Regione Puglia, in collaborazione tra Quavlive, PeoplewareAI e il Politecnico di Bari.",
    "Il mio contributo si colloca nell'OR3 (Applicazioni intelligenti per l'e-learning), guidato da PeoplewareAI: ho progettato e sviluppato il modulo Meeting Intelligence per l'analisi del sentiment e della tossicità nelle riunioni virtuali.",
    "Mi interessa l'intersezione tra ingegneria del software e intelligenza artificiale, oltre che allo sviluppo front-end. Cerco ambienti dove l'architettura conta quanto il prodotto e il codice viene scritto per durare.",
  ],

  // ── Cosa cerco (mostrato in un blocco evidenziato) ─────────────────
  lookingFor: {
    title: "Cosa cerco",
    roles: ["Software Engineer", "Frontend Engineer", "ML Engineer"],
    preferences: [
      "Architettura a microservizi e sistemi distribuiti",
      "Team che praticano anche lo sviluppo front-end",
      "Progetti con impatto misurabile (non solo prototipo)",
      "Remoto o ibrido, in Italia o in Europa",
    ],
  },

  // ── Altri progetti (aggiungi quanti ne vuoi) ───────────────────────
  projects: [
    // {
    //   title: "Nome progetto",
    //   desc: "Breve descrizione di cosa fa e perché l'hai fatto.",
    //   tech: ["Tech1", "Tech2"],
    //   link: "https://github.com/...",   // "" per nascondere
    // },
    // {
    //   title: "Altro progetto",
    //   desc: "Descrizione.",
    //   tech: ["Tech1"],
    //   link: "",
    // },
  ],

  // ── Istruzione ─────────────────────────────────────────────────────
  education: [
    {
      degree: "Laurea Triennale in Informatica e Tecnologie per la Produzione del Software",
      institution: "Università degli Studi di Bari Aldo Moro",
      year: "2026",
      notes: "Tesi: Progetto Arianna: Una dashboard per la visualizzazione del sentiment in una piattaforma di e-learning",
    },
    // {
    //   degree: "Laurea Triennale in Informatica",
    //   institution: "Università degli Studi di Bari Aldo Moro",
    //   year: "2023",
    //   grade: "",
    //   notes: "",
    // },
  ],

  // ── Certificazioni / Corsi (opzionale) ─────────────────────────────
  certifications: [
    // { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2025" },
    // { name: "Deep Learning Specialization", issuer: "Coursera · Andrew Ng", year: "2024" },
  ],

  // ── Competenze ─────────────────────────────────────────────────────
  skills: [
    { category: "Linguaggi", items: ["Python", "JavaScript", "SQL"] },
    { category: "Frontend", items: ["React", "Vite", "Chart.js", "HTML / CSS"] },
    { category: "Backend", items: ["FastAPI", "REST API"] },
    { category: "ML / NLP", items: ["HuggingFace Transformers", "BERT", "Sentiment Analysis", "Toxicity Detection"] },
    { category: "Infrastruttura", items: ["Docker", "Docker Compose"] },
    { category: "Testing", items: ["pytest", "pytest-asyncio", "Coverage", "TDD"] },
    { category: "Strumenti", items: ["Git", "GitHub", "VS Code"] },
  ],

  // ── Lingue ─────────────────────────────────────────────────────────
  languages: [
    { lang: "Italiano", level: "Madrelingua" },
    { lang: "Inglese", level: "B2" },
  ],

  // ── Interessi professionali ────────────────────────────────────────
  interests: [
    "Architetture event-driven e microservizi",
    "Open source e contributi a progetti pubblici",
    "Frontend development e data visualization",
    "DevEx — strumenti che rendono gli sviluppatori più produttivi",
  ],
};

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  LAYOUT                                                             ║
// ╚══════════════════════════════════════════════════════════════════════╝

const C = {
  bg: "#0b0e13",
  surface: "#111520",
  surfaceAlt: "#161b28",
  border: "#1e2535",
  borderLight: "#2a3348",
  accent: "#6c9cfc",
  accentAlt: "#8bb4ff",
  accentDim: "#6c9cfc12",
  accentBorder: "#6c9cfc25",
  warm: "#f0c674",
  white: "#eaecf0",
  dim: "#7d8594",
  muted: "#4b5263",
  neg: "#fc6c6c",
  display: "'Fraunces', Georgia, serif",
  body: "'General Sans', 'DM Sans', sans-serif",
  mono: "'Berkeley Mono', 'Fira Code', monospace",
};

const NAVS = [
  { id: "about", label: "Chi sono" },
  { id: "thesis", label: "Tesi" },
  ...(CONFIG.projects.length > 0 ? [{ id: "projects", label: "Progetti" }] : []),
  { id: "skills", label: "Skills" },
  { id: "education", label: "Formazione" },
  { id: "contact", label: "Contatti" },
];

function useVis(t = 0.1) {
  const r = useRef(null);
  const [v, s] = useState(false);
  useEffect(() => {
    const el = r.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { s(true); o.unobserve(el); } }, { threshold: t });
    o.observe(el); return () => o.disconnect();
  }, [t]);
  return [r, v];
}

function In({ children, d = 0, y = 24, style = {} }) {
  const [r, v] = useVis();
  return <div ref={r} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: `all 0.6s cubic-bezier(.23,1,.32,1) ${d}s` }}>{children}</div>;
}

function Sec({ id, num, label, title, children, style = {} }) {
  return (
    <section id={id} style={{ padding: "100px 0", ...style }}>
      <In>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ fontFamily: C.mono, fontSize: 13, color: C.accent, fontWeight: 500 }}>{num}</span>
          <div style={{ height: 1, width: 28, background: C.accent, opacity: 0.35 }} />
          <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
        </div>
        <h2 style={{ fontFamily: C.display, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, margin: "0 0 40px", lineHeight: 1.2, color: C.white, fontStyle: "italic" }}>
          {title}
        </h2>
      </In>
      {children}
    </section>
  );
}

function Card({ children, style = {}, glow = false }) {
  const [h, sH] = useState(false);
  return (
    <div
      onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
      style={{
        background: C.surface, borderRadius: 14, border: `1px solid ${h ? C.borderLight : C.border}`,
        transition: "all 0.3s ease",
        boxShadow: h && glow ? `0 4px 32px ${C.accent}10` : "none",
        transform: h ? "translateY(-2px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Pill({ children, accent = false }) {
  return (
    <span style={{
      fontFamily: C.mono, fontSize: 11, padding: "5px 13px", borderRadius: 20,
      color: accent ? C.accent : C.dim,
      background: accent ? C.accentDim : `${C.muted}15`,
      border: `1px solid ${accent ? C.accentBorder : `${C.muted}20`}`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export default function Portfolio() {
  const [act, setAct] = useState("");
  const [sy, setSy] = useState(0);

  useEffect(() => {
    const h = () => {
      setSy(window.scrollY);
      const ids = ["home", ...NAVS.map(n => n.id)];
      const secs = ids.map(id => { const el = document.getElementById(id); return el ? { id, top: el.offsetTop - 150 } : null; }).filter(Boolean);
      const cur = secs.filter(s => window.scrollY >= s.top).pop();
      if (cur) setAct(cur.id);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const links = [
    CONFIG.email && { l: "Email", h: `mailto:${CONFIG.email}`, d: CONFIG.email, i: "✉" },
    CONFIG.phone && { l: "Telefono", h: `tel:${CONFIG.phone.replace(/\s/g, "")}`, d: CONFIG.phone, i: "☎" },
    CONFIG.linkedin && { l: "LinkedIn", h: CONFIG.linkedin, d: "linkedin.com", i: "in" },
    CONFIG.github && { l: "GitHub", h: CONFIG.github, d: "github.com", i: "<>" },
    CONFIG.website && { l: "Web", h: CONFIG.website, d: CONFIG.website.replace(/https?:\/\//, ""), i: "◉" },
  ].filter(Boolean);

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: C.body, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=DM+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`::selection { background: ${C.accent}35; color: ${C.white}; }`}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: sy > 40 ? `${C.bg}e6` : "transparent",
        backdropFilter: sy > 40 ? "blur(16px) saturate(1.5)" : "none",
        borderBottom: `1px solid ${sy > 40 ? C.border : "transparent"}`,
        transition: "all 0.35s",
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 58 }}>
          <div onClick={() => go("home")} style={{ cursor: "pointer", fontFamily: C.display, fontSize: 20, fontWeight: 600, color: C.white }}>
            {CONFIG.name[0]}<span style={{ color: C.accent }}>{CONFIG.surname[0]}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {NAVS.map(n => (
              <button key={n.id} onClick={() => go(n.id)} style={{
                background: act === n.id ? C.accentDim : "none",
                border: act === n.id ? `1px solid ${C.accentBorder}` : "1px solid transparent",
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                fontFamily: C.body, fontSize: 12.5, fontWeight: 500,
                color: act === n.id ? C.accent : C.dim,
                transition: "all 0.2s",
              }}>{n.label}</button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 28px" }}>

        {/* ═══ HERO ═══ */}
        <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "15%", right: "5%", width: 400, height: 400, background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "20%", left: "-5%", width: 300, height: 300, background: `radial-gradient(circle, ${C.warm}05 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ width: "100%", position: "relative" }}>
            <In>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <span style={{ fontFamily: C.mono, fontSize: 13, color: C.accent }}>{CONFIG.role}</span>
                {CONFIG.availability && (
                  <>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.muted }} />
                    <span style={{ fontFamily: C.mono, fontSize: 12, color: "#5ddb68", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5ddb68", boxShadow: "0 0 8px #5ddb6855" }} />
                      {CONFIG.availability}
                    </span>
                  </>
                )}
              </div>
            </In>
            <In d={0.06}>
              <h1 style={{ fontFamily: C.display, fontSize: "clamp(46px, 7vw, 82px)", fontWeight: 500, lineHeight: 1.08, margin: "0 0 28px", letterSpacing: "-0.02em" }}>
                {CONFIG.name}{" "}
                <span style={{ fontStyle: "italic", color: C.accent }}>{CONFIG.surname}</span>
              </h1>
            </In>
            <In d={0.12}>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: C.dim, maxWidth: 540, margin: "0 0 36px", whiteSpace: "pre-line" }}>{CONFIG.bio}</p>
            </In>
            <In d={0.18}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
                <button onClick={() => go("thesis")} style={{
                  background: C.accent, color: C.bg, border: "none", borderRadius: 8,
                  padding: "12px 26px", fontFamily: C.body, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 6px 24px ${C.accent}30`; }}
                  onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
                >Vedi il progetto</button>
                <button onClick={() => go("contact")} style={{
                  background: "none", color: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "12px 26px", fontFamily: C.body, fontSize: 14, fontWeight: 500,
                  cursor: "pointer", transition: "border-color 0.3s",
                }}
                  onMouseEnter={e => e.target.style.borderColor = C.accent}
                  onMouseLeave={e => e.target.style.borderColor = C.border}
                >Contattami</button>
              </div>
            </In>
            {/* Quick links row */}
            <In d={0.24}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {links.map((l, i) => (
                  <a key={i} href={l.h} target={l.h.startsWith("mailto") || l.h.startsWith("tel") ? undefined : "_blank"}
                    rel="noopener noreferrer" style={{
                      fontFamily: C.mono, fontSize: 12, color: C.dim, textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.color = C.accent}
                    onMouseLeave={e => e.target.style.color = C.dim}
                  >{l.d} ↗</a>
                ))}
              </div>
            </In>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <Sec id="about" num="01" label="Background" title="Chi sono">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {CONFIG.about.map((p, i) => (
              <In key={i} d={i * 0.06}>
                <Card style={{ padding: "26px 24px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: C.dim, margin: 0 }}>{p}</p>
                </Card>
              </In>
            ))}
          </div>

          {/* Looking for */}
          {CONFIG.lookingFor && (
            <In d={0.2}>
              <div style={{
                marginTop: 32, borderRadius: 14, padding: "28px 28px",
                background: `linear-gradient(135deg, ${C.accentDim}, ${C.surfaceAlt})`,
                border: `1px solid ${C.accentBorder}`,
              }}>
                <div style={{ fontFamily: C.body, fontSize: 15, fontWeight: 600, color: C.accent, marginBottom: 16 }}>
                  {CONFIG.lookingFor.title}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {CONFIG.lookingFor.roles.map((r, i) => <Pill key={i} accent>{r}</Pill>)}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {CONFIG.lookingFor.preferences.map((p, i) => (
                    <li key={i} style={{ fontSize: 13, lineHeight: 1.75, color: C.dim, marginBottom: 4 }}>{p}</li>
                  ))}
                </ul>
              </div>
            </In>
          )}
        </Sec>

        {/* ═══ THESIS ═══ */}
        <Sec id="thesis" num="02" label="Progetto principale" title={CONFIG.thesis.title}>
          <In>
            <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.6, margin: "-24px 0 8px", fontStyle: "italic" }}>{CONFIG.thesis.subtitle}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <Pill accent>{CONFIG.thesis.context}</Pill>
              <Pill>{CONFIG.thesis.advisor}</Pill>
              <Pill>{CONFIG.thesis.institution}</Pill>
              <Pill>{CONFIG.thesis.period}</Pill>
            </div>
          </In>

          {/* Stats */}
          <In d={0.06}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 36 }}>
              {CONFIG.thesis.stats.map((s, i) => (
                <Card key={i} style={{ padding: "22px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: C.display, fontSize: 32, color: C.accent, lineHeight: 1, fontWeight: 500 }}>{s.value}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                </Card>
              ))}
            </div>
          </In>

          {/* Terminal */}
          <In d={0.1}>
            <Card style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, marginLeft: 10 }}>architettura</span>
              </div>
              <pre style={{ fontFamily: C.mono, fontSize: 12, lineHeight: 1.8, color: C.dim, margin: 0, padding: "22px 24px", whiteSpace: "pre-wrap" }}>
                {CONFIG.thesis.architecture}
              </pre>
            </Card>
          </In>

          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
            {CONFIG.thesis.highlights.map((f, i) => (
              <In key={i} d={0.12 + i * 0.04}>
                <Card glow style={{ padding: "24px 22px", height: "100%" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.accent, fontSize: 16 }}>›</span> {f.title}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: C.dim, margin: 0 }}>{f.desc}</p>
                </Card>
              </In>
            ))}
          </div>
        </Sec>

        {/* ═══ PROJECTS (conditional) ═══ */}
        {CONFIG.projects.length > 0 && (
          <Sec id="projects" num="03" label="Altri progetti" title="Progetti">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {CONFIG.projects.map((p, i) => (
                <In key={i} d={i * 0.06}>
                  <Card glow style={{ padding: "24px 22px", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.white }}>{p.title}</div>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, textDecoration: "none" }}>↗ repo</a>}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: C.dim, margin: "0 0 14px" }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.tech.map((t, j) => <Pill key={j}>{t}</Pill>)}
                    </div>
                  </Card>
                </In>
              ))}
            </div>
          </Sec>
        )}

        {/* ═══ SKILLS ═══ */}
        <Sec id="skills" num={CONFIG.projects.length > 0 ? "04" : "03"} label="Stack" title="Competenze tecniche">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {CONFIG.skills.map((g, i) => (
              <In key={i} d={i * 0.04}>
                <Card glow style={{ padding: "22px 20px" }}>
                  <div style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, fontWeight: 500 }}>
                    {g.category}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.items.map((s, j) => <Pill key={j}>{s}</Pill>)}
                  </div>
                </Card>
              </In>
            ))}
          </div>

          {/* Languages */}
          {CONFIG.languages.length > 0 && (
            <In d={0.3}>
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", marginRight: 4 }}>Lingue</span>
                {CONFIG.languages.map((l, i) => <Pill key={i}>{l.lang} — {l.level}</Pill>)}
              </div>
            </In>
          )}

          {/* Interests */}
          {CONFIG.interests.length > 0 && (
            <In d={0.35}>
              <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", marginRight: 4 }}>Interessi</span>
                {CONFIG.interests.map((it, i) => <Pill key={i} accent>{it}</Pill>)}
              </div>
            </In>
          )}
        </Sec>

        {/* ═══ EDUCATION ═══ */}
        <Sec id="education" num={CONFIG.projects.length > 0 ? "05" : "04"} label="Formazione" title="Istruzione">
          {CONFIG.education.map((edu, i) => (
            <In key={i} d={i * 0.06}>
              <Card style={{ padding: "26px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontFamily: C.display, fontSize: 17, fontWeight: 500, margin: 0, color: C.white, fontStyle: "italic" }}>{edu.degree}</h3>
                  <span style={{ fontFamily: C.mono, fontSize: 12, color: C.muted }}>{edu.year}</span>
                </div>
                <div style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.accent, marginBottom: 8 }}>{edu.institution}</div>
                {edu.notes && <p style={{ fontSize: 13, lineHeight: 1.7, color: C.dim, margin: 0 }}>{edu.notes}</p>}
                {edu.grade && <div style={{ fontFamily: C.mono, fontSize: 13, color: C.warm, marginTop: 8, fontWeight: 500 }}>{edu.grade}</div>}
              </Card>
            </In>
          ))}

          {/* Certifications */}
          {CONFIG.certifications.length > 0 && (
            <In d={0.15}>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Certificazioni</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CONFIG.certifications.map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{c.issuer}</div>
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}>{c.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </In>
          )}
        </Sec>

        {/* ═══ CONTACT ═══ */}
        <Sec id="contact" num={CONFIG.projects.length > 0 ? "06" : "05"} label="Contatto" title="Parliamone">
          <In>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.dim, maxWidth: 480, margin: "-16px 0 32px" }}>
              Aperto a opportunità di lavoro, collaborazioni e scambi di idee su architetture e AI.
            </p>
          </In>
          <In d={0.06}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {links.map((l, i) => (
                <a key={i} href={l.h} target={l.h.startsWith("mailto") || l.h.startsWith("tel") ? undefined : "_blank"}
                  rel="noopener noreferrer" style={{ textDecoration: "none", color: C.white }}>
                  <Card glow style={{ padding: "20px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: C.accentDim, border: `1px solid ${C.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: C.mono, fontSize: 14, fontWeight: 600, color: C.accent, flexShrink: 0,
                    }}>{l.i}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{l.l}</div>
                      <div style={{ fontFamily: C.mono, fontSize: 11, color: C.muted, marginTop: 2 }}>{l.d}</div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </In>
        </Sec>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 28px", maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}>© 2025 {CONFIG.name} {CONFIG.surname}</span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}>{CONFIG.location}</span>
      </footer>
    </div>
  );
}