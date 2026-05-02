/* ===========================================
   Resume Builder — Editor Logic
   =========================================== */

(function() {
  'use strict';

  // ----- State -----
  const STORAGE_KEY = 'resumely_data_v1';
  const STORAGE_TPL = 'resumely_template_v1';

  const DEFAULT_DATA = {
    personal: {
      fullName: 'Your Name',
      title: 'Your Job Title',
      email: 'you@email.com',
      phone: '(555) 123-4567',
      location: 'City, Country',
      website: '',
      linkedin: ''
    },
    summary: 'Write a 2–3 sentence summary that highlights your experience, strengths, and the kind of role you\'re looking for.',
    experience: [
      {
        role: 'Job Title',
        company: 'Company Name',
        location: 'City, Country',
        start: '2022',
        end: 'Present',
        bullets: [
          'Describe a key responsibility or accomplishment, ideally with a number or measurable outcome.',
          'Add another bullet that highlights an impact you made.'
        ]
      }
    ],
    education: [
      {
        degree: 'Degree',
        school: 'University Name',
        location: 'City, Country',
        start: '2018',
        end: '2022',
        notes: ''
      }
    ],
    skillsRaw: 'Skill 1, Skill 2, Skill 3, Skill 4',
    skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
    projects: [],
    certifications: [],
    languages: [],
    additionalSections: []
  };

  let data = loadData();
  let currentTemplateId = loadTemplateId();

  // ----- Storage -----
  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function loadTemplateId() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('template');
    if (fromUrl && getTemplateById(fromUrl)) return fromUrl;
    const fromStorage = localStorage.getItem(STORAGE_TPL);
    if (fromStorage && getTemplateById(fromStorage)) return fromStorage;
    return RESUME_TEMPLATES[0].id;
  }

  function saveTemplateId() {
    try { localStorage.setItem(STORAGE_TPL, currentTemplateId); } catch (e) {}
  }

  // ----- Template Switcher -----
  function buildTemplateSwitcher() {
    const sel = document.getElementById('template-switcher');
    sel.innerHTML = '';
    RESUME_TEMPLATES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `Template #${t.number} — ${t.name}`;
      if (t.id === currentTemplateId) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', e => {
      currentTemplateId = e.target.value;
      saveTemplateId();
      renderPreview();
    });
  }

  // ----- Form rendering -----
  const REPEAT_SCHEMAS = {
    experience: {
      fields: [
        { key: 'role', label: 'Job title', type: 'text', full: true },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'start', label: 'Start', type: 'text' },
        { key: 'end', label: 'End', type: 'text' },
        { key: 'bullets', label: 'Bullet points (one per line)', type: 'textarea-list', full: true }
      ],
      empty: () => ({ role: '', company: '', location: '', start: '', end: '', bullets: [] })
    },
    education: {
      fields: [
        { key: 'degree', label: 'Degree', type: 'text', full: true },
        { key: 'school', label: 'School', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'start', label: 'Start', type: 'text' },
        { key: 'end', label: 'End', type: 'text' },
        { key: 'notes', label: 'Notes (honors, GPA, thesis…)', type: 'text', full: true }
      ],
      empty: () => ({ degree: '', school: '', location: '', start: '', end: '', notes: '' })
    },
    projects: {
      fields: [
        { key: 'name', label: 'Project name', type: 'text', full: true },
        { key: 'link', label: 'Link', type: 'text', full: true },
        { key: 'description', label: 'Description', type: 'textarea', full: true }
      ],
      empty: () => ({ name: '', link: '', description: '' })
    },
    certifications: {
      fields: [
        { key: 'name', label: 'Name', type: 'text', full: true },
        { key: 'issuer', label: 'Issuer', type: 'text' },
        { key: 'date', label: 'Date', type: 'text' }
      ],
      empty: () => ({ name: '', issuer: '', date: '' })
    },
    languages: {
      fields: [
        { key: 'name', label: 'Language', type: 'text' },
        { key: 'level', label: 'Proficiency', type: 'text' }
      ],
      empty: () => ({ name: '', level: '' })
    },
    additionalSections: {
      fields: [
        { key: 'title', label: 'Section title', type: 'text', full: true },
        { key: 'items', label: 'Items (one per line)', type: 'textarea-list', full: true }
      ],
      empty: () => ({ title: '', items: [] })
    }
  };

  function renderRepeatList(key) {
    const container = document.getElementById(`${key}-list`);
    if (!container) return;
    const schema = REPEAT_SCHEMAS[key];
    container.innerHTML = '';
    (data[key] || []).forEach((item, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'repeat-item';
      wrap.innerHTML = `
        <button type="button" class="repeat-item-remove" data-remove="${key}" data-idx="${idx}" title="Remove">×</button>
        <div class="form-grid">
          ${schema.fields.map(f => {
            const id = `${key}-${idx}-${f.key}`;
            const val = item[f.key];
            const valStr = Array.isArray(val) ? val.join('\n') : (val || '');
            const escVal = String(valStr).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
            const cls = f.full ? 'form-field form-grid-full' : 'form-field';
            if (f.type === 'textarea' || f.type === 'textarea-list') {
              return `<div class="${cls}"><label>${f.label}</label><textarea rows="3" data-repeat="${key}" data-idx="${idx}" data-key="${f.key}" data-mode="${f.type}">${escVal}</textarea></div>`;
            }
            return `<div class="${cls}"><label>${f.label}</label><input type="text" value="${escVal}" data-repeat="${key}" data-idx="${idx}" data-key="${f.key}" /></div>`;
          }).join('')}
        </div>
      `;
      container.appendChild(wrap);
    });
  }

  function renderAllRepeats() {
    Object.keys(REPEAT_SCHEMAS).forEach(renderRepeatList);
  }

  function fillSimpleFields() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const path = el.dataset.field.split('.');
      let v = data;
      for (const p of path) {
        if (v == null) { v = ''; break; }
        v = v[p];
      }
      if (v == null) v = '';
      el.value = v;
    });
  }

  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] == null || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  // ----- CV Import -----
  function setStartMode(mode) {
    const uploadPanel = document.getElementById('upload-panel');
    document.querySelectorAll('[data-start-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.startMode === mode);
    });
    if (uploadPanel) uploadPanel.classList.toggle('is-hidden', mode !== 'upload');
    if (mode === 'new') {
      toast('Ready for a new CV');
      document.getElementById('section-personal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setImportStatus(message) {
    const status = document.getElementById('import-status');
    if (status) status.textContent = message;
  }

  async function readCvFile(file) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.txt')) return await file.text();
    if (name.endsWith('.docx')) {
      if (!window.mammoth) throw new Error('Word import library is still loading. Please try again.');
      const buffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value || '';
    }
    if (name.endsWith('.pdf')) {
      if (!window.pdfjsLib) throw new Error('PDF import library is still loading. Please try again.');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const buffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const rows = new Map();
        content.items.forEach(item => {
          const y = Math.round(item.transform[5]);
          const existing = rows.get(y) || [];
          existing.push({ x: item.transform[4], text: item.str });
          rows.set(y, existing);
        });
        const pageLines = Array.from(rows.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([, row]) => row.sort((a, b) => a.x - b.x).map(part => part.text).join(' ').trim())
          .filter(Boolean);
        pages.push(pageLines.join('\n'));
      }
      return pages.join('\n');
    }
    throw new Error('Please upload a PDF, DOCX, or text CV.');
  }

  function cleanLine(line) {
    return line
      .replace(/[•●▪◦]/g, '- ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeHeading(line) {
    return cleanLine(line).replace(/[:\-–—]+$/g, '').toLowerCase();
  }

  function isSectionHeading(line, labels) {
    const text = normalizeHeading(line);
    return labels.some(label => {
      const normalized = label.toLowerCase();
      return text === normalized || text === normalized.replace(/\s+/g, '');
    });
  }

  function sectionBetween(lines, labels) {
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      if (isSectionHeading(lines[i], labels)) {
        start = i + 1;
        break;
      }
    }
    if (start === -1) return [];

    const stopWords = [
      'summary', 'profile', 'professional summary', 'career objective', 'objective',
      'experience', 'work experience', 'professional experience', 'employment history',
      'education', 'academic qualification', 'academic qualifications', 'qualifications',
      'skills', 'technical skills', 'core skills', 'key skills',
      'projects', 'key projects', 'project experience',
      'certifications', 'certificates', 'licenses', 'licences',
      'languages', 'language'
    ];

    let end = lines.length;
    for (let i = start; i < lines.length; i++) {
      if (isSectionHeading(lines[i], stopWords)) {
        end = i;
        break;
      }
    }
    return lines.slice(start, end).map(cleanLine).filter(Boolean);
  }

  function hasDate(line) {
    return /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)?[a-z]*\.?\s*(?:19|20)\d{2}|present|current|till date|to date/i.test(line);
  }

  function extractDates(lines) {
    const text = lines.join(' ');
    const years = text.match(/(?:19|20)\d{2}/g) || [];
    const start = years[0] || '';
    let end = years[1] || '';
    if (/present|current|till date|to date/i.test(text)) end = 'Present';
    return { start, end };
  }

  function stripDateText(line) {
    return cleanLine(line)
      .replace(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*/ig, '')
      .replace(/\b(?:19|20)\d{2}\b/g, '')
      .replace(/\b(?:present|current|till date|to date)\b/ig, '')
      .replace(/\s*(?:-|–|—|to)\s*$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function likelyRole(line) {
    return /manager|engineer|developer|designer|analyst|accountant|sales|executive|officer|specialist|consultant|coordinator|assistant|administrator|supervisor|director|lead|head|hr|recruiter|technician|nurse|teacher|marketing|finance|operations|customer|support|secretary|driver|chef|waiter|cashier/i.test(line);
  }

  function likelyDegree(line) {
    return /bachelor|master|mba|b\.?sc|m\.?sc|b\.?com|m\.?com|b\.?tech|m\.?tech|degree|diploma|certificate|university|college|school|institute|secondary|higher secondary|phd|doctorate/i.test(line);
  }

  function likelyEducationStart(line) {
    return /bachelor|master|mba|b\.?sc|m\.?sc|b\.?com|m\.?com|b\.?tech|m\.?tech|degree|diploma|certificate|secondary|higher secondary|phd|doctorate/i.test(line);
  }

  function likelyExperienceHeader(line) {
    const text = stripDateText(line);
    if (isListMarker(text) || text.length > 95) return false;
    return likelyRole(text) || /\s[-–—|]\s/.test(text);
  }

  function isListMarker(line) {
    return /^[-*]\s+|^\d+[.)]\s+/.test(line);
  }

  function splitIntoEntries(lines, isNewEntry) {
    const entries = [];
    let current = [];

    lines.forEach(line => {
      const cleaned = cleanLine(line);
      if (!cleaned) return;

      if (current.length && isNewEntry(cleaned, current)) {
        entries.push(current);
        current = [];
      }
      current.push(cleaned);
    });

    if (current.length) entries.push(current);
    return entries;
  }

  function parseExperienceEntry(lines) {
    const dateInfo = extractDates(lines);
    const nonBulletLines = lines
      .filter(line => !isListMarker(line))
      .map(stripDateText)
      .filter(Boolean);

    let role = nonBulletLines.find(likelyRole) || nonBulletLines[0] || '';
    let company = '';
    let location = '';

    if (role.includes('|')) {
      const parts = role.split('|').map(cleanLine).filter(Boolean);
      role = parts[0] || role;
      company = parts[1] || '';
      location = parts[2] || '';
    } else if (role.includes(' at ')) {
      const parts = role.split(/\s+at\s+/i).map(cleanLine);
      role = parts[0] || role;
      company = parts[1] || '';
    } else if (role.includes(' - ') || role.includes(' – ') || role.includes(' — ')) {
      const parts = role.split(/\s[-–—]\s/).map(cleanLine).filter(Boolean);
      if (parts.length >= 2) {
        role = parts[0];
        company = parts[1];
      }
    }

    if (!company) {
      company = nonBulletLines.find(line => line !== role && !likelyRole(line)) || '';
    }

    const bulletCandidates = lines
      .map(line => cleanLine(line).replace(/^[-*]\s+|^\d+[.)]\s+/, ''))
      .filter(line => {
        const stripped = stripDateText(line);
        return line && !hasDate(line) && stripped !== role && stripped !== company;
      });

    return {
      role,
      company,
      location,
      start: dateInfo.start,
      end: dateInfo.end,
      bullets: bulletCandidates.slice(0, 8)
    };
  }

  function parseExperience(lines) {
    const chunks = [];
    let current = [];

    lines.forEach((line, idx) => {
      const cleaned = cleanLine(line);
      if (!cleaned) return;

      const nextLines = lines.slice(idx + 1, idx + 3);
      const startsNewDatedEntry = current.length >= 3 && current.some(hasDate) && hasDate(cleaned);
      const startsNewHeaderEntry = current.length >= 3 && current.some(hasDate) && likelyExperienceHeader(cleaned) && nextLines.some(hasDate);

      if (current.length && (startsNewDatedEntry || startsNewHeaderEntry)) {
        chunks.push(current);
        current = [];
      }

      current.push(cleaned);
    });

    if (current.length) chunks.push(current);

    return chunks
      .map(parseExperienceEntry)
      .filter(item => item.role || item.company || item.bullets.length)
      .slice(0, 12);
  }

  function parseEducationEntry(lines) {
    const dateInfo = extractDates(lines);
    const cleaned = lines.map(stripDateText).filter(Boolean);
    const degree = cleaned.find(likelyDegree) || cleaned[0] || '';
    const school = cleaned.find(line => line !== degree && /university|college|school|institute|academy/i.test(line)) || '';
    const notes = cleaned.filter(line => line !== degree && line !== school).slice(0, 3).join(' · ');

    return {
      degree,
      school,
      location: '',
      start: dateInfo.start,
      end: dateInfo.end,
      notes
    };
  }

  function parseEducation(lines) {
    const chunks = splitIntoEntries(lines, (line, current) => {
      if (likelyEducationStart(line) && current.some(likelyEducationStart) && (current.some(hasDate) || current.length >= 3)) return true;
      if (hasDate(line) && current.some(hasDate) && current.some(likelyEducationStart)) return true;
      return false;
    });

    return chunks
      .map(parseEducationEntry)
      .filter(item => item.degree || item.school)
      .slice(0, 8);
  }

  function parseCertifications(lines) {
    const chunks = splitIntoEntries(lines, (line, current) => {
      if (isListMarker(line)) return true;
      if (hasDate(line) && current.some(hasDate)) return true;
      return current.length >= 2 && /^[A-Z0-9]/.test(line);
    });

    return chunks.map(chunk => {
      const dateInfo = extractDates(chunk);
      const name = stripDateText(chunk[0] || '');
      const issuer = stripDateText(chunk.find((line, idx) => idx > 0 && !hasDate(line)) || '');
      return { name, issuer, date: dateInfo.end || dateInfo.start };
    }).filter(item => item.name).slice(0, 12);
  }

  function parseProjects(lines) {
    const chunks = splitIntoEntries(lines, (line, current) => {
      if (isListMarker(line)) return true;
      if (/project|system|website|app|platform|portal|dashboard|implementation/i.test(line) && current.length >= 2) return true;
      return current.length >= 4;
    });

    return chunks.map(chunk => {
      const first = cleanLine(chunk[0] || '').replace(/^[-*]\s+|^\d+[.)]\s+/, '');
      const link = chunk.find(line => /https?:|www\.|github\.com/i.test(line)) || '';
      const description = chunk
        .slice(1)
        .filter(line => line !== link)
        .map(line => line.replace(/^[-*]\s+|^\d+[.)]\s+/, ''))
        .join(' ');
      return { name: first, link, description };
    }).filter(item => item.name).slice(0, 10);
  }

  function parseLanguages(lines) {
    return lines.flatMap(line => line.split(/[,|]/)).map(item => {
      const parts = item.split(/[-–—:]/).map(cleanLine).filter(Boolean);
      return { name: parts[0] || '', level: parts[1] || '' };
    }).filter(item => item.name).slice(0, 10);
  }

  function parseSkills(lines) {
    return lines
      .join(', ')
      .split(/[,|;]/)
      .map(skill => skill.replace(/^[-*]\s+/, '').trim())
      .filter(Boolean)
      .slice(0, 40);
  }

  function parseImportedCv(text) {
    const lines = text
      .split(/\r?\n|(?<=\.)\s{2,}/)
      .map(cleanLine)
      .filter(Boolean);

    const joined = lines.join('\n');
    const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
    const phone = joined.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] || '';
    const linkedin = joined.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i)?.[0] || '';
    const website = joined.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin\.com)([a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/i)?.[0] || '';
    const firstContentLine = lines.find(line => !line.includes('@') && !line.match(/\d{7,}/) && !/linkedin|www\.|https?:/i.test(line) && !isSectionHeading(line, ['resume', 'curriculum vitae', 'cv'])) || '';

    const summaryLines = sectionBetween(lines, ['summary', 'profile', 'professional summary', 'career objective', 'objective']);
    const skillsLines = sectionBetween(lines, ['skills', 'technical skills', 'core skills', 'key skills']);
    const educationLines = sectionBetween(lines, ['education', 'academic qualification', 'academic qualifications', 'qualifications']);
    const certificationLines = sectionBetween(lines, ['certifications', 'certificates', 'licenses', 'licences']);
    const projectLines = sectionBetween(lines, ['projects', 'key projects', 'project experience']);
    const languageLines = sectionBetween(lines, ['languages', 'language']);
    const experienceLines = sectionBetween(lines, ['experience', 'work experience', 'professional experience', 'employment history']);

    const skills = parseSkills(skillsLines);
    const experience = parseExperience(experienceLines);
    const education = parseEducation(educationLines);
    const certifications = parseCertifications(certificationLines);
    const projects = parseProjects(projectLines);
    const languages = parseLanguages(languageLines);
    const summary = summaryLines.slice(0, 5).join(' ') || DEFAULT_DATA.summary;

    return {
      personal: {
        fullName: firstContentLine || data.personal.fullName || '',
        title: lines[1] && lines[1] !== email && !lines[1].match(/\d{7,}/) && !isSectionHeading(lines[1], ['summary', 'profile']) ? lines[1] : data.personal.title || '',
        email,
        phone,
        location: data.personal.location || '',
        website,
        linkedin
      },
      summary,
      experience: experience.length ? experience : data.experience,
      education: education.length ? education : data.education,
      skillsRaw: skills.length ? skills.join(', ') : data.skillsRaw || '',
      skills: skills.length ? skills : data.skills,
      projects: projects.length ? projects : data.projects || [],
      certifications: certifications.length ? certifications : data.certifications || [],
      languages: languages.length ? languages : data.languages || [],
      additionalSections: data.additionalSections || []
    };
  }

  async function improveCvWithAi(cvData) {
    const response = await fetch('/api/improve-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'AI CV improvement failed');
    }
    return result;
  }

  async function parseCvWithAi(cvText) {
    const response = await fetch('/api/parse-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'AI CV parsing failed');
    }
    return result;
  }

  function looksLikeExperienceBullet(text) {
    const value = String(text || '').trim();
    if (!value) return false;
    if (value.length > 90) return true;
    if (value.split(/\s+/).length > 10) return true;
    return /^(led|managed|prepared|conducted|ensured|monitored|developed|implemented|coordinated|inspected|maintained|provided|supported|handled|improved|achieved|reduced|increased|performed|assisted|created|designed|delivered|facilitated|trained|reviewed|reported|enforced|verified)\b/i.test(value);
  }

  function normalizeImportedData(imported) {
    const normalized = {
      personal: {
        fullName: imported.personal?.fullName || data.personal.fullName || '',
        title: imported.personal?.title || data.personal.title || '',
        email: imported.personal?.email || '',
        phone: imported.personal?.phone || '',
        location: imported.personal?.location || data.personal.location || '',
        website: imported.personal?.website || '',
        linkedin: imported.personal?.linkedin || ''
      },
      summary: imported.summary || '',
      experience: Array.isArray(imported.experience) ? imported.experience : [],
      education: Array.isArray(imported.education) ? imported.education : [],
      skills: Array.isArray(imported.skills) ? imported.skills : [],
      projects: Array.isArray(imported.projects) ? imported.projects : [],
      certifications: Array.isArray(imported.certifications) ? imported.certifications : [],
      languages: Array.isArray(imported.languages) ? imported.languages : [],
      additionalSections: Array.isArray(imported.additionalSections) ? imported.additionalSections : []
    };

    normalized.experience = normalized.experience.map(item => {
      const bullets = Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : [];
      let role = item.role || '';

      if (looksLikeExperienceBullet(role)) {
        bullets.unshift(role);
        role = '';
      }

      return {
        role,
        company: item.company || '',
        location: item.location || '',
        start: item.start || '',
        end: item.end || '',
        bullets
      };
    }).filter(item => item.role || item.company || item.bullets.length);

    normalized.education = normalized.education.map(item => ({
      degree: item.degree || '',
      school: item.school || '',
      location: item.location || '',
      start: item.start || '',
      end: item.end || '',
      notes: item.notes || ''
    })).filter(item => item.degree || item.school || item.notes);

    normalized.projects = normalized.projects.map(item => ({
      name: item.name || '',
      link: item.link || '',
      description: item.description || ''
    })).filter(item => item.name || item.description);

    normalized.certifications = normalized.certifications.map(item => ({
      name: item.name || '',
      issuer: item.issuer || '',
      date: item.date || ''
    })).filter(item => item.name || item.issuer);

    normalized.languages = normalized.languages.map(item => ({
      name: item.name || '',
      level: item.level || ''
    })).filter(item => item.name);

    normalized.additionalSections = normalized.additionalSections.map(section => ({
      title: section.title || '',
      items: Array.isArray(section.items)
        ? section.items.map(item => String(item).trim()).filter(Boolean)
        : String(section.content || '').split(/\n+/).map(item => item.trim()).filter(Boolean)
    })).filter(section => section.title && section.items.length);

    normalized.skills = normalized.skills.map(skill => String(skill).trim()).filter(Boolean);
    normalized.skillsRaw = normalized.skills.join(', ');

    return normalized;
  }

  async function importCv(file) {
    if (!file) return;
    setImportStatus(`Reading ${file.name}...`);
    try {
      const text = await readCvFile(file);
      if (!text.trim()) throw new Error('No readable text found in this CV.');

      try {
        setImportStatus('AI is reading and organizing your CV...');
        data = normalizeImportedData(await parseCvWithAi(text));
        setImportStatus('AI import complete. Please review and adjust the sections below.');
        toast('AI filled CV sections');
      } catch (aiErr) {
        console.warn(aiErr);
        data = parseImportedCv(text);
        setImportStatus('AI import was unavailable, so the standard parser filled the sections.');
        toast('CV sections filled');
      }

      fillSimpleFields();
      renderAllRepeats();
      scheduleRender();
    } catch (err) {
      console.error(err);
      setImportStatus(err.message || 'Could not import this CV. Please try another file.');
      toast('CV import failed');
    }
  }

  // ----- Event wiring -----
  function attachFormHandlers() {
    const form = document.getElementById('form-pane');

    form.addEventListener('input', e => {
      const t = e.target;
      if (t.matches('[data-field]')) {
        setNestedValue(data, t.dataset.field, t.value);
        // Special: skillsRaw -> skills array
        if (t.dataset.field === 'skillsRaw') {
          data.skills = t.value.split(',').map(s => s.trim()).filter(Boolean);
        }
        scheduleRender();
      } else if (t.matches('[data-repeat]')) {
        const key = t.dataset.repeat;
        const idx = parseInt(t.dataset.idx, 10);
        const fkey = t.dataset.key;
        const mode = t.dataset.mode;
        if (!data[key][idx]) return;
        if (mode === 'textarea-list') {
          data[key][idx][fkey] = t.value.split('\n').map(s => s.trim()).filter(Boolean);
        } else {
          data[key][idx][fkey] = t.value;
        }
        scheduleRender();
      }
    });

    form.addEventListener('click', e => {
      const startBtn = e.target.closest('[data-start-mode]');
      if (startBtn) {
        setStartMode(startBtn.dataset.startMode);
        return;
      }


      const addBtn = e.target.closest('[data-add]');
      const removeBtn = e.target.closest('[data-remove]');
      if (addBtn) {
        const key = addBtn.dataset.add;
        if (!Array.isArray(data[key])) data[key] = [];
        data[key].push(REPEAT_SCHEMAS[key].empty());
        renderRepeatList(key);
        scheduleRender();
      } else if (removeBtn) {
        const key = removeBtn.dataset.remove;
        const idx = parseInt(removeBtn.dataset.idx, 10);
        data[key].splice(idx, 1);
        renderRepeatList(key);
        scheduleRender();
      }
    });

    const upload = document.getElementById('cv-upload');
    if (upload) {
      upload.addEventListener('change', e => importCv(e.target.files[0]));
    }
  }

  // ----- Live preview -----
  let renderTimer = null;
  function scheduleRender() {
    if (renderTimer) cancelAnimationFrame(renderTimer);
    renderTimer = requestAnimationFrame(() => {
      renderPreview();
      saveData();
    });
  }

  function fitPreview() {
    const frame = document.getElementById('preview-frame');
    const render = document.getElementById('resume-render');
    if (!frame || !render) return;
    const sourceWidth = 850;
    const pageHeight = sourceWidth * 11 / 8.5;
    const targetWidth = frame.clientWidth;
    const scale = targetWidth / sourceWidth;
    render.style.width = sourceWidth + 'px';
    render.style.minHeight = pageHeight + 'px';
    render.style.transform = `scale(${scale})`;
    render.style.transformOrigin = 'top left';

    requestAnimationFrame(() => {
      const contentHeight = Math.max(pageHeight, render.scrollHeight);
      frame.style.height = (contentHeight * scale) + 'px';
    });
  }

  function renderPreview() {
    const target = document.getElementById('resume-render');
    if (!target) return;
    target.innerHTML = renderResume(currentTemplateId, data);
    fitPreview();
  }

  async function improveCurrentCv() {
    const btn = document.getElementById('btn-ai-improve');
    if (!btn) return;

    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Improving...';
    setImportStatus('AI is improving your CV content...');

    try {
      const improved = normalizeImportedData(await improveCvWithAi(data));
      data = {
        ...improved,
        personal: {
          ...improved.personal,
          email: data.personal.email,
          phone: data.personal.phone,
          website: data.personal.website,
          linkedin: data.personal.linkedin
        }
      };
      fillSimpleFields();
      renderAllRepeats();
      scheduleRender();
      setImportStatus('AI improvement complete. Please review before downloading.');
      toast('CV improved with AI');
    } catch (err) {
      console.error(err);
      setImportStatus(err.message || 'AI improvement failed.');
      toast('AI improvement failed');
    } finally {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  }

  // ----- PDF Export -----
  async function exportPdf() {
    const btn = document.getElementById('btn-pdf');
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = 'Preparing PDF…';
    try {
      // Render at full size into a hidden container so PDF gets crisp dimensions
      const hidden = document.createElement('div');
      hidden.style.position = 'fixed';
      hidden.style.left = '-9999px';
      hidden.style.top = '0';
      hidden.style.width = '850px';
      hidden.style.background = 'white';
      hidden.innerHTML = renderResume(currentTemplateId, data);
      document.body.appendChild(hidden);

      const filename = `${(data.personal.fullName || 'resume').replace(/\s+/g, '_')}_resume.pdf`;
      await html2pdf().set({
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      }).from(hidden.firstElementChild).save();

      document.body.removeChild(hidden);
      toast('PDF downloaded');
    } catch (err) {
      console.error(err);
      toast('PDF export failed');
    } finally {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  }

  // ----- DOCX Export -----
  async function exportDocx() {
    const btn = document.getElementById('btn-docx');
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = 'Preparing Word…';
    try {
      const tpl = getTemplateById(currentTemplateId);
      const colors = COLOR_SCHEMES[tpl.colorKey];
      const blob = await buildDocx(data, colors, tpl);
      const filename = `${(data.personal.fullName || 'resume').replace(/\s+/g, '_')}_resume.docx`;
      saveAs(blob, filename);
      toast('Word document downloaded');
    } catch (err) {
      console.error(err);
      toast('Word export failed');
    } finally {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  }

  function hexToDocxColor(hex) {
    return (hex || '#000000').replace('#', '').toUpperCase();
  }

  async function buildDocx(d, colors, tpl) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, TabStopType, TabStopPosition, ShadingType } = window.docx;

    const PRIMARY = hexToDocxColor(colors.primary);
    const MUTED = hexToDocxColor(colors.muted);
    const TEXT = hexToDocxColor(colors.text);
    const ACCENT = hexToDocxColor(colors.secondary);

    const sectionHeading = (text) => new Paragraph({
      spacing: { before: 280, after: 120 },
      border: { bottom: { color: PRIMARY, space: 4, style: BorderStyle.SINGLE, size: 6 } },
      children: [
        new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: PRIMARY, characterSpacing: 30 })
      ]
    });

    const muted = (text, opts={}) => new TextRun({ text: text || '', size: 20, color: MUTED, ...opts });
    const body = (text, opts={}) => new TextRun({ text: text || '', size: 21, color: TEXT, ...opts });
    const bold = (text, opts={}) => new TextRun({ text: text || '', size: 22, color: TEXT, bold: true, ...opts });

    const children = [];

    // ----- Header -----
    const p = d.personal || {};
    children.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [new TextRun({ text: p.fullName || '', bold: true, size: 44, color: PRIMARY })]
    }));
    if (p.title) {
      children.push(new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: p.title, size: 24, color: ACCENT, italics: true })]
      }));
    }
    const contactBits = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean).join('  ·  ');
    if (contactBits) {
      children.push(new Paragraph({
        spacing: { after: 200 },
        children: [muted(contactBits)]
      }));
    }

    // ----- Summary -----
    if (d.summary) {
      children.push(sectionHeading('Profile'));
      children.push(new Paragraph({ spacing: { after: 100 }, children: [body(d.summary)] }));
    }

    // ----- Experience -----
    if (Array.isArray(d.experience) && d.experience.length) {
      children.push(sectionHeading('Experience'));
      d.experience.forEach(x => {
        // role + dates row using a tab stop
        children.push(new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 120, after: 0 },
          children: [
            bold(x.role || ''),
            new TextRun({ text: '\t', size: 20 }),
            muted(joinDates(x))
          ]
        }));
        const compLine = [x.company, x.location].filter(Boolean).join(' · ');
        if (compLine) {
          children.push(new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: compLine, size: 21, color: ACCENT, italics: true })]
          }));
        }
        if (Array.isArray(x.bullets)) {
          x.bullets.forEach(b => {
            children.push(new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [body(b)]
            }));
          });
        }
      });
    }

    // ----- Education -----
    if (Array.isArray(d.education) && d.education.length) {
      children.push(sectionHeading('Education'));
      d.education.forEach(x => {
        children.push(new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 80, after: 0 },
          children: [
            bold(x.degree || ''),
            new TextRun({ text: '\t', size: 20 }),
            muted(joinDates(x))
          ]
        }));
        const sLine = [x.school, x.location].filter(Boolean).join(' · ');
        if (sLine) {
          children.push(new Paragraph({
            spacing: { after: 30 },
            children: [new TextRun({ text: sLine, size: 21, color: ACCENT, italics: true })]
          }));
        }
        if (x.notes) children.push(new Paragraph({ spacing: { after: 60 }, children: [muted(x.notes)] }));
      });
    }

    // ----- Skills -----
    if (Array.isArray(d.skills) && d.skills.length) {
      children.push(sectionHeading('Skills'));
      children.push(new Paragraph({
        spacing: { after: 100 },
        children: [body(d.skills.join('  ·  '))]
      }));
    }

    // ----- Projects -----
    if (Array.isArray(d.projects) && d.projects.length) {
      children.push(sectionHeading('Projects'));
      d.projects.forEach(x => {
        const runs = [bold(x.name || '')];
        if (x.link) runs.push(new TextRun({ text: '  —  ' + x.link, size: 20, color: ACCENT, italics: true }));
        children.push(new Paragraph({ spacing: { before: 80, after: 30 }, children: runs }));
        if (x.description) children.push(new Paragraph({ spacing: { after: 60 }, children: [body(x.description)] }));
      });
    }

    // ----- Certifications -----
    if (Array.isArray(d.certifications) && d.certifications.length) {
      children.push(sectionHeading('Certifications'));
      d.certifications.forEach(x => {
        const tail = [x.issuer, x.date].filter(Boolean).join(' · ');
        children.push(new Paragraph({
          spacing: { before: 40, after: 30 },
          children: [
            bold(x.name || ''),
            tail ? muted('  —  ' + tail) : new TextRun({ text: '' })
          ]
        }));
      });
    }

    // ----- Languages -----
    if (Array.isArray(d.languages) && d.languages.length) {
      children.push(sectionHeading('Languages'));
      d.languages.forEach(l => {
        children.push(new Paragraph({
          spacing: { after: 30 },
          children: [bold(l.name || ''), muted('  —  ' + (l.level || ''))]
        }));
      });
    }

    if (Array.isArray(d.additionalSections) && d.additionalSections.length) {
      d.additionalSections.forEach(section => {
        children.push(sectionHeading(section.title || 'Additional Information'));
        (section.items || []).forEach(item => {
          children.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [body(item)]
          }));
        });
      });
    }

    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 22 } }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 }
          }
        },
        children: children
      }]
    });

    return await Packer.toBlob(doc);
  }

  function joinDates(item) {
    const s = item.start || '';
    const e = item.end || '';
    if (s && e) return `${s} – ${e}`;
    return s || e || '';
  }

  // ----- Toast -----
  let toastTimer = null;
  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // ----- Init -----
  function init() {
    buildTemplateSwitcher();
    fillSimpleFields();
    renderAllRepeats();
    attachFormHandlers();
    renderPreview();

    const params = new URLSearchParams(window.location.search);
    setStartMode(params.get('action') === 'upload' ? 'upload' : 'new');

    document.getElementById('btn-ai-improve')?.addEventListener('click', improveCurrentCv);
    document.getElementById('btn-pdf').addEventListener('click', exportPdf);
    document.getElementById('btn-docx').addEventListener('click', exportDocx);

    window.addEventListener('resize', fitPreview);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
