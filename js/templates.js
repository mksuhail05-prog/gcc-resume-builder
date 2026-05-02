/* ===========================================
   Resume Template System
   - 10 unique design functions
   - 5 color schemes
   - 50 named templates (design x color combinations)
   =========================================== */

// --- Sample data for previews ---
const SAMPLE_DATA = {
  personal: {
    fullName: "Alexandra Chen",
    title: "Senior Product Designer",
    email: "alex.chen@email.com",
    phone: "(415) 555-0142",
    location: "San Francisco, CA",
    website: "alexchen.design",
    linkedin: "linkedin.com/in/alexchen"
  },
  summary: "Product designer with 8+ years crafting intuitive digital experiences for fintech and SaaS. Led design systems at scale, mentored cross-functional teams, and shipped features used by millions.",
  experience: [
    { role: "Senior Product Designer", company: "Stripe", location: "San Francisco", start: "2022", end: "Present", bullets: ["Led redesign of merchant dashboard, increasing daily active use by 34%.", "Established and maintained the unified design system across 6 product teams.", "Mentored 4 designers and ran weekly critique sessions."] },
    { role: "Product Designer", company: "Airbnb", location: "Remote", start: "2019", end: "2022", bullets: ["Designed end-to-end booking flows generating $40M+ in incremental revenue.", "Partnered with research to run usability studies that informed roadmap priorities."] },
    { role: "UX Designer", company: "IBM Design", location: "Austin", start: "2016", end: "2019", bullets: ["Built enterprise dashboard frameworks adopted across 12 internal tools."] }
  ],
  education: [
    { degree: "B.F.A. Interaction Design", school: "Rhode Island School of Design", location: "Providence, RI", start: "2012", end: "2016", notes: "Magna cum laude · Senior thesis: Designing for Trust" }
  ],
  skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Accessibility", "Information Architecture", "HTML / CSS", "Webflow"],
  projects: [
    { name: "Open Source Design Tokens", description: "Authored a widely-adopted set of design tokens for accessible color systems.", link: "github.com/alexchen/tokens" }
  ],
  certifications: [
    { name: "Nielsen Norman UX Master", issuer: "NN/g", date: "2021" }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Mandarin", level: "Fluent" }
  ],
  additionalSections: [
    { title: "Awards", items: ["Design leadership award, 2023"] }
  ]
};

// --- Color schemes ---
const COLOR_SCHEMES = {
  navy:     { primary: "#1e3a8a", secondary: "#3b82f6", accent: "#dbeafe", text: "#0f172a", muted: "#475569", line: "#cbd5e1", bgSoft: "#f1f5f9" },
  slate:    { primary: "#334155", secondary: "#64748b", accent: "#e2e8f0", text: "#1e293b", muted: "#475569", line: "#cbd5e1", bgSoft: "#f8fafc" },
  burgundy: { primary: "#7f1d1d", secondary: "#b91c1c", accent: "#fee2e2", text: "#1c1917", muted: "#57534e", line: "#d6d3d1", bgSoft: "#fafaf9" },
  forest:   { primary: "#14532d", secondary: "#16a34a", accent: "#dcfce7", text: "#0f172a", muted: "#475569", line: "#cbd5e1", bgSoft: "#f0fdf4" },
  charcoal: { primary: "#111827", secondary: "#374151", accent: "#e5e7eb", text: "#0f172a", muted: "#4b5563", line: "#d1d5db", bgSoft: "#f9fafb" }
};

// --- Helpers ---
function esc(s) {
  if (s === undefined || s === null) return "";
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function nonEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

function joinDates(item) {
  const s = esc(item.start || "");
  const e = esc(item.end || "");
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

function contactBits(p, sep = " · ") {
  return [p.email, p.phone, p.location, p.website, p.linkedin]
    .filter(Boolean).map(esc).join(sep);
}

function renderAdditionalSections(d, c) {
  if (!nonEmpty(d.additionalSections)) return "";
  return d.additionalSections.map(section => {
    const title = esc(section.title || "Additional Information");
    const items = Array.isArray(section.items) ? section.items.filter(Boolean) : [];
    if (!items.length) return "";
    return `
      <section class="resume-extra-section" style="margin-top: 18pt;">
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 8pt;">${title}</h2>
        <ul style="margin: 4pt 0 0 16pt; padding: 0; font-size: 10pt; color:${c.muted}; line-height: 1.55;">
          ${items.map(item => `<li style="margin-bottom: 3pt;">${esc(item)}</li>`).join("")}
        </ul>
      </section>`;
  }).join("");
}

function appendAdditionalSections(html, d, c) {
  const extra = renderAdditionalSections(d, c);
  if (!extra) return html;
  const mainClose = html.lastIndexOf("</main>");
  if (mainClose !== -1) return html.slice(0, mainClose) + extra + html.slice(mainClose);
  const innerClose = html.lastIndexOf("</div>");
  if (innerClose !== -1) return html.slice(0, innerClose) + extra + html.slice(innerClose);
  return html + extra;
}

// --- Design 1: Modern Sidebar (left dark column) ---
function designSidebarLeft(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="padding:0; display:grid; grid-template-columns: 32% 1fr; min-height: 1100px; font-family: 'Inter', sans-serif;">
    <aside style="background:${c.primary}; color:white; padding: 36pt 24pt;">
      <div style="font-size: 22pt; font-weight: 800; letter-spacing: -0.02em; line-height:1.1; margin-bottom:6pt;">${esc(p.fullName)}</div>
      <div style="font-size: 11pt; opacity:0.85; margin-bottom: 22pt;">${esc(p.title)}</div>
      <div style="border-top: 1px solid rgba(255,255,255,0.25); padding-top: 16pt;">
        <div style="font-size: 9.5pt; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; margin-bottom: 10pt;">Contact</div>
        <div style="font-size: 10pt; line-height: 1.7; opacity: 0.95;">
          ${p.email ? `<div>${esc(p.email)}</div>` : ""}
          ${p.phone ? `<div>${esc(p.phone)}</div>` : ""}
          ${p.location ? `<div>${esc(p.location)}</div>` : ""}
          ${p.website ? `<div>${esc(p.website)}</div>` : ""}
          ${p.linkedin ? `<div>${esc(p.linkedin)}</div>` : ""}
        </div>
      </div>
      ${nonEmpty(d.skills) ? `
      <div style="border-top: 1px solid rgba(255,255,255,0.25); padding-top: 16pt; margin-top: 20pt;">
        <div style="font-size: 9.5pt; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; margin-bottom: 10pt;">Skills</div>
        <div style="font-size: 10pt; line-height: 1.8;">${d.skills.map(s => `<div>${esc(s)}</div>`).join("")}</div>
      </div>` : ""}
      ${nonEmpty(d.languages) ? `
      <div style="border-top: 1px solid rgba(255,255,255,0.25); padding-top: 16pt; margin-top: 20pt;">
        <div style="font-size: 9.5pt; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; margin-bottom: 10pt;">Languages</div>
        <div style="font-size: 10pt; line-height: 1.7;">${d.languages.map(l => `<div>${esc(l.name)} <span style="opacity:0.7;">— ${esc(l.level)}</span></div>`).join("")}</div>
      </div>` : ""}
    </aside>
    <main style="padding: 36pt 32pt; color:${c.text};">
      ${d.summary ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 8pt;">Profile</h2>
        <p style="font-size: 10.5pt; color:${c.muted}; line-height: 1.55;">${esc(d.summary)}</p>
      </section>` : ""}
      ${nonEmpty(d.experience) ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 12pt;">Experience</h2>
        ${d.experience.map(x => `
          <div style="margin-bottom: 14pt;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; gap: 12pt;">
              <div style="font-weight: 700; font-size: 11pt; color:${c.text};">${esc(x.role)}</div>
              <div style="font-size: 9.5pt; color:${c.muted}; white-space:nowrap;">${joinDates(x)}</div>
            </div>
            <div style="font-size: 10pt; color:${c.secondary}; margin-bottom: 6pt;">${esc(x.company)}${x.location ? ` · ${esc(x.location)}` : ""}</div>
            ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 16pt; padding: 0; font-size: 10pt; color:${c.muted}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 3pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}
      </section>` : ""}
      ${nonEmpty(d.education) ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 10pt;">Education</h2>
        ${d.education.map(x => `
          <div style="margin-bottom: 10pt;">
            <div style="display:flex; justify-content:space-between; gap: 12pt;">
              <div style="font-weight: 700; font-size: 11pt;">${esc(x.degree)}</div>
              <div style="font-size: 9.5pt; color:${c.muted};">${joinDates(x)}</div>
            </div>
            <div style="font-size: 10pt; color:${c.secondary};">${esc(x.school)}${x.location ? ` · ${esc(x.location)}` : ""}</div>
            ${x.notes ? `<div style="font-size: 9.5pt; color:${c.muted}; margin-top: 3pt;">${esc(x.notes)}</div>` : ""}
          </div>`).join("")}
      </section>` : ""}
      ${nonEmpty(d.projects) ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 10pt;">Projects</h2>
        ${d.projects.map(x => `
          <div style="margin-bottom: 8pt;">
            <div style="font-weight: 700; font-size: 10.5pt;">${esc(x.name)} ${x.link ? `<span style="color:${c.secondary}; font-weight: 400; font-size: 9.5pt;">— ${esc(x.link)}</span>` : ""}</div>
            ${x.description ? `<div style="font-size: 10pt; color:${c.muted};">${esc(x.description)}</div>` : ""}
          </div>`).join("")}
      </section>` : ""}
      ${nonEmpty(d.certifications) ? `
      <section>
        <h2 style="font-size: 12pt; text-transform: uppercase; letter-spacing: 0.08em; color:${c.primary}; margin-bottom: 10pt;">Certifications</h2>
        ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong>${x.issuer ? ` · <span style="color:${c.muted};">${esc(x.issuer)}</span>` : ""}${x.date ? ` <span style="color:${c.muted};">(${esc(x.date)})</span>` : ""}</div>`).join("")}
      </section>` : ""}
    </main>
  </div>`;
}

// --- Design 2: Classic Centered (serif) ---
function designClassicCenter(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Source Serif Pro', Georgia, serif; padding: 44pt 50pt; color:${c.text};">
    <header style="text-align:center; padding-bottom: 16pt; border-bottom: 2px solid ${c.primary}; margin-bottom: 22pt;">
      <h1 style="font-size: 26pt; font-weight: 700; letter-spacing: 0.02em; margin-bottom: 4pt;">${esc(p.fullName)}</h1>
      <div style="font-size: 12pt; color:${c.primary}; font-style: italic; margin-bottom: 10pt;">${esc(p.title)}</div>
      <div style="font-size: 10pt; color:${c.muted};">${contactBits(p)}</div>
    </header>
    ${d.summary ? `<section style="margin-bottom: 18pt; text-align:center;"><p style="font-size: 11pt; color:${c.muted}; line-height: 1.55; max-width: 80%; margin: 0 auto;">${esc(d.summary)}</p></section>` : ""}
    ${nonEmpty(d.experience) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 13pt; text-align:center; font-variant: small-caps; letter-spacing: 0.12em; color:${c.primary}; margin-bottom: 14pt;">Professional Experience</h2>
      ${d.experience.map(x => `
        <div style="margin-bottom: 14pt;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12pt;">
            <div><strong style="font-size: 11.5pt;">${esc(x.role)}</strong>, <em style="color:${c.primary};">${esc(x.company)}</em>${x.location ? `, ${esc(x.location)}` : ""}</div>
            <div style="font-size: 10pt; color:${c.muted}; font-style:italic;">${joinDates(x)}</div>
          </div>
          ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 18pt; font-size: 10.5pt; color:${c.text}; line-height: 1.5;">${x.bullets.map(b => `<li style="margin-bottom: 3pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.education) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 13pt; text-align:center; font-variant: small-caps; letter-spacing: 0.12em; color:${c.primary}; margin-bottom: 12pt;">Education</h2>
      ${d.education.map(x => `
        <div style="margin-bottom: 10pt;">
          <div style="display:flex; justify-content:space-between; gap:12pt;">
            <div><strong>${esc(x.degree)}</strong>, <em style="color:${c.primary};">${esc(x.school)}</em>${x.location ? `, ${esc(x.location)}` : ""}</div>
            <div style="font-size: 10pt; color:${c.muted}; font-style:italic;">${joinDates(x)}</div>
          </div>
          ${x.notes ? `<div style="font-size: 10pt; color:${c.muted};">${esc(x.notes)}</div>` : ""}
        </div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.skills) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 13pt; text-align:center; font-variant: small-caps; letter-spacing: 0.12em; color:${c.primary}; margin-bottom: 10pt;">Skills</h2>
      <p style="text-align:center; font-size: 10.5pt; color:${c.text};">${d.skills.map(esc).join(" · ")}</p>
    </section>` : ""}
    ${nonEmpty(d.projects) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 13pt; text-align:center; font-variant: small-caps; letter-spacing: 0.12em; color:${c.primary}; margin-bottom: 10pt;">Projects</h2>
      ${d.projects.map(x => `<div style="margin-bottom: 6pt;"><strong>${esc(x.name)}</strong>${x.link ? ` <em style="color:${c.muted}; font-size: 9.5pt;">— ${esc(x.link)}</em>` : ""}<br/><span style="font-size: 10pt;">${esc(x.description||"")}</span></div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.certifications) ? `
    <section>
      <h2 style="font-size: 13pt; text-align:center; font-variant: small-caps; letter-spacing: 0.12em; color:${c.primary}; margin-bottom: 10pt;">Certifications</h2>
      <p style="text-align:center; font-size: 10.5pt;">${d.certifications.map(x => `<strong>${esc(x.name)}</strong> — ${esc(x.issuer||"")}${x.date ? ` (${esc(x.date)})` : ""}`).join(" · ")}</p>
    </section>` : ""}
  </div>`;
}

// --- Design 3: Minimal Single Column ---
function designMinimal(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 50pt 48pt; color:${c.text};">
    <header style="margin-bottom: 24pt;">
      <h1 style="font-size: 28pt; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 4pt;">${esc(p.fullName)}</h1>
      <div style="font-size: 12pt; color:${c.primary}; font-weight: 500; margin-bottom: 8pt;">${esc(p.title)}</div>
      <div style="font-size: 10pt; color:${c.muted};">${contactBits(p)}</div>
    </header>
    ${d.summary ? `<section style="margin-bottom: 22pt;"><p style="font-size: 11pt; color:${c.text}; line-height: 1.6;">${esc(d.summary)}</p></section>` : ""}
    ${nonEmpty(d.experience) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-size: 11pt; font-weight: 600; color:${c.primary}; margin-bottom: 14pt; padding-bottom: 4pt; border-bottom: 1px solid ${c.line};">Experience</h2>
      ${d.experience.map(x => `
        <div style="margin-bottom: 14pt;">
          <div style="display:flex; justify-content:space-between; gap:12pt; margin-bottom: 2pt;">
            <div style="font-weight: 600; font-size: 11pt;">${esc(x.role)} <span style="color:${c.muted}; font-weight: 400;">· ${esc(x.company)}</span></div>
            <div style="font-size: 9.5pt; color:${c.muted}; white-space:nowrap;">${joinDates(x)}</div>
          </div>
          ${x.location ? `<div style="font-size: 9.5pt; color:${c.muted}; margin-bottom: 4pt;">${esc(x.location)}</div>` : ""}
          ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 16pt; font-size: 10pt; color:${c.text}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 2pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.education) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-size: 11pt; font-weight: 600; color:${c.primary}; margin-bottom: 12pt; padding-bottom: 4pt; border-bottom: 1px solid ${c.line};">Education</h2>
      ${d.education.map(x => `
        <div style="margin-bottom: 8pt;">
          <div style="display:flex; justify-content:space-between; gap:12pt;">
            <div style="font-weight: 600;">${esc(x.degree)} <span style="color:${c.muted}; font-weight: 400;">· ${esc(x.school)}</span></div>
            <div style="font-size: 9.5pt; color:${c.muted};">${joinDates(x)}</div>
          </div>
          ${x.notes ? `<div style="font-size: 10pt; color:${c.muted};">${esc(x.notes)}</div>` : ""}
        </div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.skills) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-size: 11pt; font-weight: 600; color:${c.primary}; margin-bottom: 10pt; padding-bottom: 4pt; border-bottom: 1px solid ${c.line};">Skills</h2>
      <p style="font-size: 10.5pt; color:${c.text}; line-height: 1.6;">${d.skills.map(esc).join(" · ")}</p>
    </section>` : ""}
    ${nonEmpty(d.projects) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-size: 11pt; font-weight: 600; color:${c.primary}; margin-bottom: 10pt; padding-bottom: 4pt; border-bottom: 1px solid ${c.line};">Projects</h2>
      ${d.projects.map(x => `<div style="margin-bottom: 6pt;"><strong>${esc(x.name)}</strong>${x.link ? ` <span style="color:${c.muted}; font-size: 9.5pt;">— ${esc(x.link)}</span>` : ""}<br/><span style="font-size: 10pt; color:${c.muted};">${esc(x.description||"")}</span></div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.certifications) ? `
    <section>
      <h2 style="font-size: 11pt; font-weight: 600; color:${c.primary}; margin-bottom: 10pt; padding-bottom: 4pt; border-bottom: 1px solid ${c.line};">Certifications</h2>
      ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 3pt;">${esc(x.name)}${x.issuer ? ` · <span style="color:${c.muted};">${esc(x.issuer)}</span>` : ""}${x.date ? ` <span style="color:${c.muted};">(${esc(x.date)})</span>` : ""}</div>`).join("")}
    </section>` : ""}
  </div>`;
}

// --- Design 4: Creative Color Header ---
function designCreativeHeader(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 0; color:${c.text};">
    <header style="background: linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%); color:white; padding: 36pt 44pt;">
      <h1 style="font-size: 30pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 4pt;">${esc(p.fullName)}</h1>
      <div style="font-size: 13pt; opacity: 0.95; margin-bottom: 14pt;">${esc(p.title)}</div>
      <div style="font-size: 10pt; opacity: 0.9;">${contactBits(p)}</div>
    </header>
    <div style="padding: 26pt 44pt 36pt;">
      ${d.summary ? `<section style="margin-bottom: 22pt;"><p style="font-size: 11pt; color:${c.muted}; line-height: 1.6;">${esc(d.summary)}</p></section>` : ""}
      ${nonEmpty(d.experience) ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 14pt; font-weight: 700; color:${c.primary}; margin-bottom: 14pt; display:flex; align-items:center; gap: 10pt;"><span style="width: 22pt; height: 2pt; background: ${c.primary}; display: inline-block;"></span>EXPERIENCE</h2>
        ${d.experience.map(x => `
          <div style="margin-bottom: 14pt; padding-left: 14pt; border-left: 2px solid ${c.accent};">
            <div style="display:flex; justify-content:space-between; gap:12pt;">
              <div style="font-weight: 700; font-size: 11.5pt;">${esc(x.role)}</div>
              <div style="font-size: 10pt; color:${c.secondary}; font-weight: 600; white-space:nowrap;">${joinDates(x)}</div>
            </div>
            <div style="font-size: 10.5pt; color:${c.muted}; margin-bottom: 6pt;">${esc(x.company)}${x.location ? ` · ${esc(x.location)}` : ""}</div>
            ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 14pt; font-size: 10pt; color:${c.text}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 3pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}
      </section>` : ""}
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 22pt;">
        <div>
          ${nonEmpty(d.education) ? `
          <section style="margin-bottom: 18pt;">
            <h2 style="font-size: 14pt; font-weight: 700; color:${c.primary}; margin-bottom: 10pt; display:flex; align-items:center; gap: 10pt;"><span style="width: 22pt; height: 2pt; background: ${c.primary}; display: inline-block;"></span>EDUCATION</h2>
            ${d.education.map(x => `
              <div style="margin-bottom: 10pt;">
                <div style="font-weight: 700; font-size: 11pt;">${esc(x.degree)}</div>
                <div style="font-size: 10pt; color:${c.muted};">${esc(x.school)}</div>
                <div style="font-size: 9.5pt; color:${c.secondary};">${joinDates(x)}</div>
              </div>`).join("")}
          </section>` : ""}
          ${nonEmpty(d.languages) ? `
          <section>
            <h2 style="font-size: 14pt; font-weight: 700; color:${c.primary}; margin-bottom: 10pt; display:flex; align-items:center; gap: 10pt;"><span style="width: 22pt; height: 2pt; background: ${c.primary}; display: inline-block;"></span>LANGUAGES</h2>
            ${d.languages.map(l => `<div style="font-size: 10.5pt;"><strong>${esc(l.name)}</strong> — <span style="color:${c.muted};">${esc(l.level)}</span></div>`).join("")}
          </section>` : ""}
        </div>
        <div>
          ${nonEmpty(d.skills) ? `
          <section style="margin-bottom: 18pt;">
            <h2 style="font-size: 14pt; font-weight: 700; color:${c.primary}; margin-bottom: 10pt; display:flex; align-items:center; gap: 10pt;"><span style="width: 22pt; height: 2pt; background: ${c.primary}; display: inline-block;"></span>SKILLS</h2>
            <div style="display:flex; flex-wrap:wrap; gap: 6pt;">${d.skills.map(s => `<span style="background: ${c.accent}; color: ${c.primary}; padding: 4pt 10pt; border-radius: 12pt; font-size: 9.5pt; font-weight: 500;">${esc(s)}</span>`).join("")}</div>
          </section>` : ""}
          ${nonEmpty(d.certifications) ? `
          <section>
            <h2 style="font-size: 14pt; font-weight: 700; color:${c.primary}; margin-bottom: 10pt; display:flex; align-items:center; gap: 10pt;"><span style="width: 22pt; height: 2pt; background: ${c.primary}; display: inline-block;"></span>CERTIFICATIONS</h2>
            ${d.certifications.map(x => `<div style="font-size: 10.5pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong><br/><span style="color:${c.muted}; font-size: 9.5pt;">${esc(x.issuer||"")}${x.date ? ` · ${esc(x.date)}` : ""}</span></div>`).join("")}
          </section>` : ""}
        </div>
      </div>
    </div>
  </div>`;
}

// --- Design 5: Two-column Compact ---
function designTwoColumn(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 36pt 40pt; color:${c.text};">
    <header style="border-bottom: 3px solid ${c.primary}; padding-bottom: 14pt; margin-bottom: 18pt; display:flex; justify-content:space-between; align-items:flex-end; gap: 20pt;">
      <div>
        <h1 style="font-size: 24pt; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 2pt; color:${c.primary};">${esc(p.fullName)}</h1>
        <div style="font-size: 12pt; color:${c.muted};">${esc(p.title)}</div>
      </div>
      <div style="font-size: 9.5pt; color:${c.muted}; text-align: right; line-height: 1.6;">
        ${p.email ? `<div>${esc(p.email)}</div>` : ""}
        ${p.phone ? `<div>${esc(p.phone)}</div>` : ""}
        ${p.location ? `<div>${esc(p.location)}</div>` : ""}
        ${p.website ? `<div>${esc(p.website)}</div>` : ""}
      </div>
    </header>
    <div style="display:grid; grid-template-columns: 2.2fr 1fr; gap: 24pt;">
      <div>
        ${d.summary ? `
        <section style="margin-bottom: 18pt;">
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Profile</h2>
          <p style="font-size: 10.5pt; color:${c.text}; line-height: 1.55;">${esc(d.summary)}</p>
        </section>` : ""}
        ${nonEmpty(d.experience) ? `
        <section style="margin-bottom: 18pt;">
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 10pt;">Experience</h2>
          ${d.experience.map(x => `
            <div style="margin-bottom: 12pt;">
              <div style="font-weight: 700; font-size: 11pt;">${esc(x.role)}</div>
              <div style="font-size: 10pt; color:${c.muted}; margin-bottom: 4pt;">${esc(x.company)}${x.location ? ` · ${esc(x.location)}` : ""} <span style="color:${c.secondary};">· ${joinDates(x)}</span></div>
              ${nonEmpty(x.bullets) ? `<ul style="margin: 2pt 0 0 14pt; font-size: 10pt; color:${c.text}; line-height: 1.5;">${x.bullets.map(b => `<li style="margin-bottom: 2pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
            </div>`).join("")}
        </section>` : ""}
        ${nonEmpty(d.projects) ? `
        <section>
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Projects</h2>
          ${d.projects.map(x => `<div style="margin-bottom: 6pt;"><strong style="font-size: 10.5pt;">${esc(x.name)}</strong>${x.link ? ` <span style="color:${c.muted}; font-size: 9pt;">${esc(x.link)}</span>` : ""}<div style="font-size: 10pt; color:${c.muted};">${esc(x.description||"")}</div></div>`).join("")}
        </section>` : ""}
      </div>
      <div>
        ${nonEmpty(d.education) ? `
        <section style="margin-bottom: 16pt;">
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Education</h2>
          ${d.education.map(x => `<div style="margin-bottom: 8pt;"><strong style="font-size: 10.5pt;">${esc(x.degree)}</strong><div style="font-size: 10pt; color:${c.muted};">${esc(x.school)}</div><div style="font-size: 9.5pt; color:${c.secondary};">${joinDates(x)}</div></div>`).join("")}
        </section>` : ""}
        ${nonEmpty(d.skills) ? `
        <section style="margin-bottom: 16pt;">
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Skills</h2>
          <div style="font-size: 10pt; line-height: 1.7;">${d.skills.map(s => `<div>· ${esc(s)}</div>`).join("")}</div>
        </section>` : ""}
        ${nonEmpty(d.certifications) ? `
        <section style="margin-bottom: 16pt;">
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Certifications</h2>
          ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong><br/><span style="color:${c.muted}; font-size: 9.5pt;">${esc(x.issuer||"")}${x.date ? ` (${esc(x.date)})` : ""}</span></div>`).join("")}
        </section>` : ""}
        ${nonEmpty(d.languages) ? `
        <section>
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform:uppercase; letter-spacing: 0.08em; margin-bottom: 8pt;">Languages</h2>
          ${d.languages.map(l => `<div style="font-size: 10pt; margin-bottom: 3pt;"><strong>${esc(l.name)}</strong> <span style="color:${c.muted};">— ${esc(l.level)}</span></div>`).join("")}
        </section>` : ""}
      </div>
    </div>
  </div>`;
}

// --- Design 6: Elegant Serif Banner ---
function designElegantSerif(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Source Serif Pro', Georgia, serif; padding: 0; color:${c.text};">
    <div style="background: ${c.bgSoft}; padding: 40pt 48pt; border-bottom: 4pt double ${c.primary};">
      <h1 style="font-size: 32pt; font-weight: 600; letter-spacing: 0.04em; text-align:center; margin-bottom: 4pt; color:${c.primary};">${esc(p.fullName)}</h1>
      <div style="text-align:center; font-style: italic; font-size: 12pt; color:${c.muted}; margin-bottom: 10pt;">${esc(p.title)}</div>
      <div style="text-align:center; font-size: 10pt; color:${c.muted}; letter-spacing: 0.02em;">${contactBits(p, " | ")}</div>
    </div>
    <div style="padding: 30pt 48pt 40pt;">
      ${d.summary ? `<section style="margin-bottom: 22pt;"><p style="font-size: 11.5pt; color:${c.text}; line-height: 1.6; font-style: italic; text-align:center;">${esc(d.summary)}</p></section>` : ""}
      ${nonEmpty(d.experience) ? `
      <section style="margin-bottom: 22pt;">
        <h2 style="font-size: 14pt; text-align:center; color:${c.primary}; letter-spacing: 0.18em; margin-bottom: 14pt; text-transform:uppercase; font-weight: 600;">— Experience —</h2>
        ${d.experience.map(x => `
          <div style="margin-bottom: 14pt; text-align:center;">
            <div style="font-weight: 700; font-size: 12pt;">${esc(x.role)}</div>
            <div style="font-style: italic; font-size: 10.5pt; color:${c.primary};">${esc(x.company)}${x.location ? `, ${esc(x.location)}` : ""} · ${joinDates(x)}</div>
            ${nonEmpty(x.bullets) ? `<ul style="text-align: left; margin: 6pt auto 0; max-width: 90%; font-size: 10.5pt; color:${c.text}; line-height: 1.55; padding-left: 16pt;">${x.bullets.map(b => `<li style="margin-bottom: 3pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}
      </section>` : ""}
      ${nonEmpty(d.education) ? `
      <section style="margin-bottom: 18pt;">
        <h2 style="font-size: 14pt; text-align:center; color:${c.primary}; letter-spacing: 0.18em; margin-bottom: 12pt; text-transform:uppercase; font-weight: 600;">— Education —</h2>
        ${d.education.map(x => `
          <div style="text-align:center; margin-bottom: 8pt;">
            <div style="font-weight: 700; font-size: 11pt;">${esc(x.degree)}</div>
            <div style="font-style: italic; font-size: 10pt; color:${c.primary};">${esc(x.school)}${x.location ? `, ${esc(x.location)}` : ""} · ${joinDates(x)}</div>
            ${x.notes ? `<div style="font-size: 10pt; color:${c.muted};">${esc(x.notes)}</div>` : ""}
          </div>`).join("")}
      </section>` : ""}
      ${nonEmpty(d.skills) ? `
      <section style="margin-bottom: 18pt;">
        <h2 style="font-size: 14pt; text-align:center; color:${c.primary}; letter-spacing: 0.18em; margin-bottom: 10pt; text-transform:uppercase; font-weight: 600;">— Skills —</h2>
        <p style="text-align:center; font-size: 10.5pt; color:${c.text};">${d.skills.map(esc).join(" • ")}</p>
      </section>` : ""}
      ${nonEmpty(d.certifications) ? `
      <section>
        <h2 style="font-size: 14pt; text-align:center; color:${c.primary}; letter-spacing: 0.18em; margin-bottom: 10pt; text-transform:uppercase; font-weight: 600;">— Certifications —</h2>
        <p style="text-align:center; font-size: 10.5pt;">${d.certifications.map(x => `<strong>${esc(x.name)}</strong>${x.issuer ? ` — ${esc(x.issuer)}` : ""}${x.date ? ` (${esc(x.date)})` : ""}`).join(" • ")}</p>
      </section>` : ""}
    </div>
  </div>`;
}

// --- Design 7: Tech / Monospace accents ---
function designTechModern(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 40pt 44pt; color:${c.text};">
    <header style="margin-bottom: 22pt;">
      <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; margin-bottom: 4pt;">// ${esc(p.title || 'profile')}</div>
      <h1 style="font-size: 28pt; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4pt; color:${c.text};">${esc(p.fullName)}</h1>
      <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 9.5pt; color:${c.muted}; margin-top: 6pt;">${contactBits(p, " · ")}</div>
    </header>
    ${d.summary ? `
    <section style="margin-bottom: 22pt; padding: 14pt 16pt; background:${c.bgSoft}; border-left: 3pt solid ${c.primary};">
      <p style="font-size: 10.5pt; color:${c.text}; line-height: 1.55;">${esc(d.summary)}</p>
    </section>` : ""}
    ${nonEmpty(d.experience) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12pt;">[experience]</h2>
      ${d.experience.map(x => `
        <div style="margin-bottom: 14pt; padding-bottom: 12pt; border-bottom: 1px dashed ${c.line};">
          <div style="display:flex; justify-content:space-between; gap: 12pt;">
            <div style="font-weight: 700; font-size: 11.5pt;">${esc(x.role)} <span style="color:${c.primary};">@</span> <span style="color:${c.primary};">${esc(x.company)}</span></div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 9.5pt; color:${c.muted}; white-space:nowrap;">${joinDates(x)}</div>
          </div>
          ${x.location ? `<div style="font-size: 9.5pt; color:${c.muted}; margin-top: 2pt;">${esc(x.location)}</div>` : ""}
          ${nonEmpty(x.bullets) ? `<ul style="margin: 6pt 0 0 0; padding-left: 16pt; font-size: 10pt; color:${c.text}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 2pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
    </section>` : ""}
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 22pt;">
      <div>
        ${nonEmpty(d.education) ? `
        <section style="margin-bottom: 16pt;">
          <h2 style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8pt;">[education]</h2>
          ${d.education.map(x => `<div style="margin-bottom: 8pt;"><strong style="font-size: 10.5pt;">${esc(x.degree)}</strong><div style="font-size: 10pt; color:${c.muted};">${esc(x.school)}</div><div style="font-family:monospace; font-size: 9pt; color:${c.secondary};">${joinDates(x)}</div></div>`).join("")}
        </section>` : ""}
        ${nonEmpty(d.projects) ? `
        <section>
          <h2 style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8pt;">[projects]</h2>
          ${d.projects.map(x => `<div style="margin-bottom: 6pt; font-size: 10pt;"><strong>${esc(x.name)}</strong>${x.link ? `<div style="font-family:monospace; font-size: 9pt; color:${c.primary};">${esc(x.link)}</div>` : ""}<div style="color:${c.muted};">${esc(x.description||"")}</div></div>`).join("")}
        </section>` : ""}
      </div>
      <div>
        ${nonEmpty(d.skills) ? `
        <section style="margin-bottom: 16pt;">
          <h2 style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8pt;">[skills]</h2>
          <div style="display:flex; flex-wrap:wrap; gap: 4pt;">${d.skills.map(s => `<span style="font-family: 'JetBrains Mono', monospace; font-size: 9pt; padding: 2pt 8pt; background:${c.bgSoft}; border: 1px solid ${c.line}; color:${c.primary};">${esc(s)}</span>`).join("")}</div>
        </section>` : ""}
        ${nonEmpty(d.certifications) ? `
        <section>
          <h2 style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10pt; color:${c.secondary}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8pt;">[certifications]</h2>
          ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong><div style="color:${c.muted}; font-size: 9pt;">${esc(x.issuer||"")}${x.date ? ` · ${esc(x.date)}` : ""}</div></div>`).join("")}
        </section>` : ""}
      </div>
    </div>
  </div>`;
}

// --- Design 8: Bold Statement ---
function designBoldStatement(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 44pt 48pt; color:${c.text};">
    <header style="margin-bottom: 24pt;">
      <h1 style="font-size: 44pt; font-weight: 900; letter-spacing: -0.04em; line-height: 0.95; color:${c.primary}; margin-bottom: 6pt; text-transform: uppercase;">${esc((p.fullName||"").split(" ")[0]||"")}</h1>
      <h1 style="font-size: 44pt; font-weight: 200; letter-spacing: -0.04em; line-height: 0.95; color:${c.primary}; margin-bottom: 14pt; text-transform: uppercase;">${esc((p.fullName||"").split(" ").slice(1).join(" ")||"")}</h1>
      <div style="height: 3pt; width: 80pt; background:${c.primary}; margin-bottom: 14pt;"></div>
      <div style="font-size: 13pt; font-weight: 600; color:${c.text}; margin-bottom: 6pt;">${esc(p.title)}</div>
      <div style="font-size: 10pt; color:${c.muted};">${contactBits(p)}</div>
    </header>
    ${d.summary ? `<section style="margin-bottom: 22pt;"><p style="font-size: 11.5pt; color:${c.text}; line-height: 1.55; font-weight: 500;">${esc(d.summary)}</p></section>` : ""}
    ${nonEmpty(d.experience) ? `
    <section style="margin-bottom: 22pt;">
      <h2 style="font-size: 18pt; font-weight: 800; color:${c.primary}; letter-spacing: -0.02em; margin-bottom: 14pt;">Experience.</h2>
      ${d.experience.map(x => `
        <div style="margin-bottom: 14pt;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap: 12pt;">
            <div style="font-weight: 800; font-size: 12pt; color:${c.text};">${esc(x.role)}</div>
            <div style="font-size: 10pt; color:${c.muted}; white-space:nowrap; font-weight: 600;">${joinDates(x)}</div>
          </div>
          <div style="font-size: 10.5pt; color:${c.primary}; font-weight: 600; margin-bottom: 6pt;">${esc(x.company)}${x.location ? ` / ${esc(x.location)}` : ""}</div>
          ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 16pt; font-size: 10.5pt; color:${c.text}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 3pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
    </section>` : ""}
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 24pt;">
      <div>
        ${nonEmpty(d.education) ? `
        <section style="margin-bottom: 18pt;">
          <h2 style="font-size: 18pt; font-weight: 800; color:${c.primary}; letter-spacing: -0.02em; margin-bottom: 10pt;">Education.</h2>
          ${d.education.map(x => `<div style="margin-bottom: 8pt;"><strong style="font-size: 11pt;">${esc(x.degree)}</strong><div style="font-size: 10pt; color:${c.muted};">${esc(x.school)} · ${joinDates(x)}</div></div>`).join("")}
        </section>` : ""}
      </div>
      <div>
        ${nonEmpty(d.skills) ? `
        <section style="margin-bottom: 18pt;">
          <h2 style="font-size: 18pt; font-weight: 800; color:${c.primary}; letter-spacing: -0.02em; margin-bottom: 10pt;">Skills.</h2>
          <p style="font-size: 10.5pt; color:${c.text}; line-height: 1.65;">${d.skills.map(esc).join(" / ")}</p>
        </section>` : ""}
      </div>
    </div>
    ${nonEmpty(d.certifications) ? `
    <section style="margin-top: 8pt;">
      <h2 style="font-size: 18pt; font-weight: 800; color:${c.primary}; letter-spacing: -0.02em; margin-bottom: 10pt;">Certifications.</h2>
      ${d.certifications.map(x => `<div style="font-size: 10.5pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong>${x.issuer ? ` — <span style="color:${c.muted};">${esc(x.issuer)}</span>` : ""}${x.date ? ` <span style="color:${c.muted};">(${esc(x.date)})</span>` : ""}</div>`).join("")}
    </section>` : ""}
  </div>`;
}

// --- Design 9: Corporate Formal ---
function designCorporate(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 36pt 44pt; color:${c.text};">
    <header style="text-align:center; padding-bottom: 14pt; border-bottom: 1px solid ${c.line}; margin-bottom: 18pt;">
      <h1 style="font-size: 22pt; font-weight: 700; letter-spacing: 0.04em; color:${c.primary}; text-transform: uppercase; margin-bottom: 4pt;">${esc(p.fullName)}</h1>
      <div style="font-size: 11pt; color:${c.muted}; letter-spacing: 0.05em;">${esc(p.title)}</div>
      <div style="font-size: 9.5pt; color:${c.muted}; margin-top: 8pt;">${contactBits(p, " · ")}</div>
    </header>
    ${d.summary ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 4pt; border-bottom: 1px solid ${c.line}; margin-bottom: 8pt;">Summary</h2>
      <p style="font-size: 10.5pt; color:${c.text}; line-height: 1.6;">${esc(d.summary)}</p>
    </section>` : ""}
    ${nonEmpty(d.experience) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 4pt; border-bottom: 1px solid ${c.line}; margin-bottom: 10pt;">Professional Experience</h2>
      ${d.experience.map(x => `
        <div style="margin-bottom: 12pt;">
          <div style="display:flex; justify-content:space-between; gap:12pt;">
            <div style="font-weight: 700; font-size: 11pt;">${esc(x.company)}</div>
            <div style="font-size: 10pt; color:${c.muted};">${esc(x.location||"")}</div>
          </div>
          <div style="display:flex; justify-content:space-between; gap:12pt; font-style: italic;">
            <div style="font-size: 10.5pt; color:${c.primary};">${esc(x.role)}</div>
            <div style="font-size: 10pt; color:${c.muted};">${joinDates(x)}</div>
          </div>
          ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 16pt; font-size: 10pt; color:${c.text}; line-height: 1.5;">${x.bullets.map(b => `<li style="margin-bottom: 2pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
    </section>` : ""}
    ${nonEmpty(d.education) ? `
    <section style="margin-bottom: 18pt;">
      <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 4pt; border-bottom: 1px solid ${c.line}; margin-bottom: 10pt;">Education</h2>
      ${d.education.map(x => `
        <div style="margin-bottom: 8pt;">
          <div style="display:flex; justify-content:space-between; gap:12pt;">
            <div><strong>${esc(x.school)}</strong>, ${esc(x.location||"")}</div>
            <div style="font-size: 10pt; color:${c.muted};">${joinDates(x)}</div>
          </div>
          <div style="font-style: italic; font-size: 10.5pt; color:${c.primary};">${esc(x.degree)}</div>
          ${x.notes ? `<div style="font-size: 10pt; color:${c.muted};">${esc(x.notes)}</div>` : ""}
        </div>`).join("")}
    </section>` : ""}
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 22pt;">
      <div>
        ${nonEmpty(d.skills) ? `
        <section>
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 4pt; border-bottom: 1px solid ${c.line}; margin-bottom: 8pt;">Skills</h2>
          <p style="font-size: 10pt; line-height: 1.6;">${d.skills.map(esc).join(", ")}</p>
        </section>` : ""}
      </div>
      <div>
        ${nonEmpty(d.certifications) ? `
        <section>
          <h2 style="font-size: 11pt; font-weight: 700; color:${c.primary}; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 4pt; border-bottom: 1px solid ${c.line}; margin-bottom: 8pt;">Certifications</h2>
          ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong>${x.issuer ? `, <em>${esc(x.issuer)}</em>` : ""}${x.date ? ` (${esc(x.date)})` : ""}</div>`).join("")}
        </section>` : ""}
      </div>
    </div>
  </div>`;
}

// --- Design 10: Refined Card-style ---
function designRefined(d, c) {
  const p = d.personal || {};
  return `
  <div class="resume-doc" style="font-family: 'Inter', sans-serif; padding: 32pt 36pt; color:${c.text}; background:${c.bgSoft};">
    <div style="background:white; padding: 28pt 32pt; border-radius: 4pt; box-shadow: 0 0 0 1px ${c.line};">
      <header style="display:grid; grid-template-columns: auto 1fr; gap: 18pt; align-items:center; margin-bottom: 20pt;">
        <div style="width: 56pt; height: 56pt; border-radius: 50%; background: linear-gradient(135deg, ${c.primary}, ${c.secondary}); color:white; display:grid; place-items:center; font-size: 22pt; font-weight: 800;">${esc((p.fullName||"  ").split(" ").slice(0,2).map(s=>s[0]||"").join(""))}</div>
        <div>
          <h1 style="font-size: 22pt; font-weight: 700; letter-spacing: -0.01em; line-height: 1.1; margin-bottom: 2pt;">${esc(p.fullName)}</h1>
          <div style="font-size: 11pt; color:${c.primary}; font-weight: 600; margin-bottom: 4pt;">${esc(p.title)}</div>
          <div style="font-size: 9.5pt; color:${c.muted};">${contactBits(p)}</div>
        </div>
      </header>
      ${d.summary ? `<section style="margin-bottom: 18pt; padding: 12pt 14pt; background:${c.bgSoft}; border-radius: 4pt;"><p style="font-size: 10.5pt; color:${c.text}; line-height: 1.55;">${esc(d.summary)}</p></section>` : ""}
      ${nonEmpty(d.experience) ? `
      <section style="margin-bottom: 18pt;">
        <h2 style="font-size: 12pt; font-weight: 700; color:${c.primary}; margin-bottom: 12pt;">Experience</h2>
        ${d.experience.map(x => `
          <div style="margin-bottom: 12pt; padding-bottom: 10pt; border-bottom: 1px solid ${c.line};">
            <div style="display:flex; justify-content:space-between; gap: 12pt; margin-bottom: 2pt;">
              <div style="font-weight: 700; font-size: 11pt;">${esc(x.role)}</div>
              <div style="font-size: 9.5pt; color:white; background:${c.primary}; padding: 2pt 8pt; border-radius: 12pt; font-weight: 600; white-space:nowrap;">${joinDates(x)}</div>
            </div>
            <div style="font-size: 10pt; color:${c.muted}; margin-bottom: 4pt;">${esc(x.company)}${x.location ? ` · ${esc(x.location)}` : ""}</div>
            ${nonEmpty(x.bullets) ? `<ul style="margin: 4pt 0 0 16pt; font-size: 10pt; color:${c.text}; line-height: 1.55;">${x.bullets.map(b => `<li style="margin-bottom: 2pt;">${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}
      </section>` : ""}
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 22pt;">
        <div>
          ${nonEmpty(d.education) ? `
          <section style="margin-bottom: 14pt;">
            <h2 style="font-size: 12pt; font-weight: 700; color:${c.primary}; margin-bottom: 8pt;">Education</h2>
            ${d.education.map(x => `<div style="margin-bottom: 6pt;"><strong style="font-size: 10.5pt;">${esc(x.degree)}</strong><div style="font-size: 9.5pt; color:${c.muted};">${esc(x.school)} · ${joinDates(x)}</div></div>`).join("")}
          </section>` : ""}
          ${nonEmpty(d.languages) ? `
          <section>
            <h2 style="font-size: 12pt; font-weight: 700; color:${c.primary}; margin-bottom: 8pt;">Languages</h2>
            ${d.languages.map(l => `<div style="font-size: 10pt; margin-bottom: 3pt;"><strong>${esc(l.name)}</strong> <span style="color:${c.muted};">— ${esc(l.level)}</span></div>`).join("")}
          </section>` : ""}
        </div>
        <div>
          ${nonEmpty(d.skills) ? `
          <section style="margin-bottom: 14pt;">
            <h2 style="font-size: 12pt; font-weight: 700; color:${c.primary}; margin-bottom: 8pt;">Skills</h2>
            <div style="display:flex; flex-wrap:wrap; gap: 4pt;">${d.skills.map(s => `<span style="font-size: 9pt; padding: 2pt 8pt; background:${c.accent}; color:${c.primary}; border-radius: 12pt; font-weight: 500;">${esc(s)}</span>`).join("")}</div>
          </section>` : ""}
          ${nonEmpty(d.certifications) ? `
          <section>
            <h2 style="font-size: 12pt; font-weight: 700; color:${c.primary}; margin-bottom: 8pt;">Certifications</h2>
            ${d.certifications.map(x => `<div style="font-size: 10pt; margin-bottom: 4pt;"><strong>${esc(x.name)}</strong><div style="color:${c.muted}; font-size: 9pt;">${esc(x.issuer||"")}${x.date ? ` · ${esc(x.date)}` : ""}</div></div>`).join("")}
          </section>` : ""}
        </div>
      </div>
    </div>
  </div>`;
}

// --- Design registry ---
const DESIGNS = [
  { id: "sidebar",  name: "Modern Sidebar", category: "Modern",     fn: designSidebarLeft },
  { id: "classic",  name: "Classic",        category: "Traditional", fn: designClassicCenter },
  { id: "minimal",  name: "Minimal",        category: "Simple",     fn: designMinimal },
  { id: "creative", name: "Creative",       category: "Creative",   fn: designCreativeHeader },
  { id: "twocol",   name: "Two-Column",     category: "Modern",     fn: designTwoColumn },
  { id: "elegant",  name: "Elegant",        category: "Traditional", fn: designElegantSerif },
  { id: "tech",     name: "Tech",           category: "Creative",   fn: designTechModern },
  { id: "bold",     name: "Bold",           category: "Creative",   fn: designBoldStatement },
  { id: "corporate",name: "Corporate",      category: "Traditional", fn: designCorporate },
  { id: "refined",  name: "Refined",        category: "Modern",     fn: designRefined }
];

const COLOR_NAMES = {
  navy: "Navy",
  slate: "Slate",
  burgundy: "Burgundy",
  forest: "Forest",
  charcoal: "Charcoal"
};

// Build the 50 templates list (10 designs x 5 colors)
const TEMPLATES = [];
DESIGNS.forEach((design, di) => {
  Object.keys(COLOR_SCHEMES).forEach((colorKey, ci) => {
    TEMPLATES.push({
      id: `${design.id}-${colorKey}`,
      name: `${design.name} · ${COLOR_NAMES[colorKey]}`,
      designId: design.id,
      colorKey: colorKey,
      category: design.category,
      number: di * 5 + ci + 1
    });
  });
});

// ===========================================
// External template engine (Mustache-like)
// Supports: {{var}}, {{nested.var}}, {{#if x}}...{{/if}},
//           {{#each list}}...{{/each}}, {{.}} for current item
// ===========================================

function _resolve(path, root, ctx) {
  if (path === '.') return ctx;
  const parts = path.split('.');
  // try current context first
  let v = ctx;
  for (const p of parts) {
    if (v && typeof v === 'object' && p in v) v = v[p];
    else { v = undefined; break; }
  }
  if (v !== undefined && v !== null) return v;
  // fall back to root data
  v = root;
  for (const p of parts) {
    if (v && typeof v === 'object' && p in v) v = v[p];
    else { v = undefined; break; }
  }
  return v;
}

function _truthy(v) {
  if (v === undefined || v === null || v === false) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'string') return v.trim().length > 0;
  return !!v;
}

function _findClose(tpl, fromIdx, type) {
  const open = `{{#${type} `;
  const open2 = `{{#${type}\t`;
  const close = `{{/${type}}}`;
  let depth = 1;
  let i = fromIdx;
  while (i < tpl.length && depth > 0) {
    let nextOpen = tpl.indexOf(open, i);
    const nextOpen2 = tpl.indexOf(open2, i);
    if (nextOpen === -1 || (nextOpen2 !== -1 && nextOpen2 < nextOpen)) nextOpen = nextOpen2;
    const nextClose = tpl.indexOf(close, i);
    if (nextClose === -1) return tpl.length;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + open.length;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      i = nextClose + close.length;
    }
  }
  return tpl.length;
}

function renderMustache(tpl, root, ctx) {
  ctx = ctx === undefined ? root : ctx;
  let out = '';
  let i = 0;
  while (i < tpl.length) {
    const start = tpl.indexOf('{{', i);
    if (start === -1) { out += tpl.slice(i); break; }
    out += tpl.slice(i, start);
    const end = tpl.indexOf('}}', start);
    if (end === -1) { out += tpl.slice(start); break; }
    const tag = tpl.slice(start + 2, end).trim();

    if (tag.startsWith('#each ')) {
      const key = tag.slice(6).trim();
      const closeIdx = _findClose(tpl, end + 2, 'each');
      const body = tpl.slice(end + 2, closeIdx);
      const items = _resolve(key, root, ctx);
      if (Array.isArray(items)) {
        items.forEach(item => { out += renderMustache(body, root, item); });
      }
      i = closeIdx + '{{/each}}'.length;
    } else if (tag.startsWith('#if ')) {
      const key = tag.slice(4).trim();
      const closeIdx = _findClose(tpl, end + 2, 'if');
      const body = tpl.slice(end + 2, closeIdx);
      if (_truthy(_resolve(key, root, ctx))) {
        out += renderMustache(body, root, ctx);
      }
      i = closeIdx + '{{/if}}'.length;
    } else if (tag === '.') {
      const v = ctx;
      out += esc(v == null ? '' : v);
      i = end + 2;
    } else if (tag.startsWith('!') || tag.startsWith('#') || tag.startsWith('/')) {
      // Unknown directive or comment — skip output
      i = end + 2;
    } else if (tag.startsWith('{') && tag.endsWith('}')) {
      // Triple-brace style for raw HTML (rarely needed)
      const v = _resolve(tag.slice(1, -1).trim(), root, ctx);
      out += (v == null ? '' : String(v));
      i = end + 2;
    } else {
      const v = _resolve(tag, root, ctx);
      out += esc(v == null ? '' : v);
      i = end + 2;
    }
  }
  return out;
}

// ===========================================
// External template loader
// Reads templates/external/manifest.json and registers each entry
// ===========================================

const EXTERNAL_BASE_PATH = 'templates/external/';

async function loadExternalTemplates(basePath) {
  basePath = basePath || EXTERNAL_BASE_PATH;
  try {
    const manifestRes = await fetch(basePath + 'manifest.json', { cache: 'no-cache' });
    if (!manifestRes.ok) return { loaded: 0, skipped: 'no-manifest' };
    const manifest = await manifestRes.json();
    const list = Array.isArray(manifest.templates) ? manifest.templates : [];
    let loaded = 0;

    for (const entry of list) {
      if (!entry.id || !entry.file) continue;
      try {
        const htmlRes = await fetch(basePath + entry.file, { cache: 'no-cache' });
        if (!htmlRes.ok) continue;
        const html = await htmlRes.text();

        // Each entry can specify which color schemes to register; default = all
        const colors = (Array.isArray(entry.colors) && entry.colors.length)
          ? entry.colors.filter(c => COLOR_SCHEMES[c])
          : Object.keys(COLOR_SCHEMES);

        colors.forEach(colorKey => {
          const id = `ext-${entry.id}-${colorKey}`;
          if (TEMPLATES.some(t => t.id === id)) return; // skip duplicates
          TEMPLATES.push({
            id: id,
            name: `${entry.name || entry.id} · ${COLOR_NAMES[colorKey] || colorKey}`,
            external: true,
            html: html,
            colorKey: colorKey,
            category: entry.category || 'Modern',
            number: TEMPLATES.length + 1
          });
        });
        loaded++;
      } catch (e) {
        console.warn('External template failed:', entry.file, e);
      }
    }

    // Notify listeners
    try {
      window.dispatchEvent(new CustomEvent('templates-loaded', { detail: { loaded } }));
    } catch (e) {}
    return { loaded };
  } catch (e) {
    return { loaded: 0, skipped: 'fetch-error', error: e.message };
  }
}

// --- Public API ---
function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id);
}

function getDesignById(id) {
  return DESIGNS.find(d => d.id === id);
}

// Compute helpful derived fields for templates (initials, first/last name)
function _computeDerived(data) {
  const fullName = (data && data.personal && data.personal.fullName) || '';
  const words = fullName.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map(w => (w[0] || '').toUpperCase()).join('') || 'YN';
  const firstName = words[0] || '';
  const lastName = words.length > 1 ? words[words.length - 1] : '';
  return { initials, firstName, lastName };
}

function renderResume(templateId, data) {
  const tpl = getTemplateById(templateId);
  if (!tpl) return '<div style="padding:40px;color:#888;">Template not found</div>';
  const colors = COLOR_SCHEMES[tpl.colorKey] || COLOR_SCHEMES.navy;

  if (tpl.external) {
    // External HTML template — provide data + colors + derived fields
    const derived = _computeDerived(data);
    const personalWithDerived = Object.assign({}, (data.personal || {}), derived);
    const root = Object.assign({}, data, {
      color: colors,
      personal: personalWithDerived,
      initials: derived.initials,
      firstName: derived.firstName,
      lastName: derived.lastName
    });
    const rendered = renderMustache(tpl.html, root);
    return appendAdditionalSections(rendered, data, colors);
  }

  const design = getDesignById(tpl.designId);
  return appendAdditionalSections(design.fn(data, colors), data, colors);
}

// Expose
window.RESUME_TEMPLATES = TEMPLATES;
window.SAMPLE_DATA = SAMPLE_DATA;
window.renderResume = renderResume;
window.getTemplateById = getTemplateById;
window.COLOR_SCHEMES = COLOR_SCHEMES;
window.loadExternalTemplates = loadExternalTemplates;
window.renderMustache = renderMustache;

// Auto-trigger external loading; pages can listen for 'templates-loaded'
loadExternalTemplates();
