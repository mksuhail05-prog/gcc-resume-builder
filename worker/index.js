function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
}

function emptyStringSchema() {
  return { type: "string" };
}

const cvSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personal: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullName: emptyStringSchema(),
        title: emptyStringSchema(),
        email: emptyStringSchema(),
        phone: emptyStringSchema(),
        location: emptyStringSchema(),
        website: emptyStringSchema(),
        linkedin: emptyStringSchema()
      },
      required: ["fullName", "title", "email", "phone", "location", "website", "linkedin"]
    },
    summary: emptyStringSchema(),
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: emptyStringSchema(),
          company: emptyStringSchema(),
          location: emptyStringSchema(),
          start: emptyStringSchema(),
          end: emptyStringSchema(),
          bullets: { type: "array", items: emptyStringSchema() }
        },
        required: ["role", "company", "location", "start", "end", "bullets"]
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: emptyStringSchema(),
          school: emptyStringSchema(),
          location: emptyStringSchema(),
          start: emptyStringSchema(),
          end: emptyStringSchema(),
          notes: emptyStringSchema()
        },
        required: ["degree", "school", "location", "start", "end", "notes"]
      }
    },
    skills: { type: "array", items: emptyStringSchema() },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: emptyStringSchema(),
          link: emptyStringSchema(),
          description: emptyStringSchema()
        },
        required: ["name", "link", "description"]
      }
    },
    certifications: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: emptyStringSchema(),
          issuer: emptyStringSchema(),
          date: emptyStringSchema()
        },
        required: ["name", "issuer", "date"]
      }
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: emptyStringSchema(),
          level: emptyStringSchema()
        },
        required: ["name", "level"]
      }
    },
    additionalSections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: emptyStringSchema(),
          items: { type: "array", items: emptyStringSchema() }
        },
        required: ["title", "items"]
      }
    }
  },
  required: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "additionalSections"]
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/improve-cv" && request.method === "POST") {
      try {
        if (!env.OPENAI_API_KEY) {
          return jsonResponse({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
        }

        const { cvData } = await request.json();
        if (!cvData || typeof cvData !== "object") {
          return jsonResponse({ error: "CV data is required." }, { status: 400 });
        }

        const aiResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            instructions: "You improve CV content for GCC job applications and ATS readability. Return strict JSON only using the same schema. Preserve all factual details, dates, companies, schools, certifications, projects, languages, phone, email, links, and section count. Do not invent jobs, degrees, certificates, companies, dates, metrics, or skills. Improve grammar, clarity, professional tone, summary, skills wording, project descriptions, and experience bullets. Keep bullets concise, action-oriented, and ATS-friendly. Do not replace real job titles with achievements.",
            input: [
              {
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `Improve this CV JSON. Keep personal contact details unchanged. Keep every existing section, including additionalSections. Improve weak bullets and summary using professional GCC recruiter language without inventing facts.\n\nCV JSON:\n${JSON.stringify(cvData).slice(0, 50000)}`
                  }
                ]
              }
            ],
            text: {
              format: {
                type: "json_schema",
                name: "gcc_resume_builder_cv",
                schema: cvSchema,
                strict: true
              }
            },
            max_output_tokens: 12000
          })
        });

        const result = await aiResponse.json();

        if (!aiResponse.ok) {
          return jsonResponse({ error: result.error?.message || "OpenAI request failed." }, { status: 502 });
        }

        if (!result.output_text) {
          return jsonResponse({ error: "AI response did not include parseable output." }, { status: 502 });
        }

        return jsonResponse(JSON.parse(result.output_text));
      } catch (error) {
        return jsonResponse({ error: error.message || "CV improvement failed." }, { status: 500 });
      }
    }

    if (url.pathname === "/api/parse-cv" && request.method === "POST") {
      try {
        if (!env.OPENAI_API_KEY) {
          return jsonResponse({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
        }

        const { cvText } = await request.json();
        const cleanText = String(cvText || "").trim().slice(0, 45000);

        if (cleanText.length < 30) {
          return jsonResponse({ error: "CV text is too short to parse." }, { status: 400 });
        }

        const aiResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            instructions: "You are a precise CV parser for GCC job applications. Return strict JSON only. Preserve every separate experience, education, project, certification, and language entry. Never invent missing details; use empty strings or empty arrays. Experience.role must be a real job title only, usually short, such as HSE Coordinator, Accountant, Site Engineer, Sales Executive, Team Leader, or Meter Technician. Do not put achievements, responsibilities, skills, project names, course names, or long sentences in role. If a line describes work performed, impact, tools, audits, reports, inspections, training, supervision, compliance, or achievements, put it in bullets. If company is unknown, leave company empty. Education.degree must be the qualification name and education.school must be the institution. Keep multiple jobs separate when dates, companies, or role titles change. Put recognized project work into projects and recognized certificates into certifications. If the CV has extra sections that do not fit the standard fields, preserve them in additionalSections with the original section heading as title and each line/item in items. Examples include Awards, Publications, Volunteering, Training, Courses, Hobbies, References, Memberships, Achievements, Additional Certificates, Professional Development, or Portfolio.",
            input: [
              {
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `Extract this CV into the requested JSON schema. Follow these rules carefully:
1. Candidate name and current title come from the header/profile area, not random section text.
2. Experience entries must be split by real role/company/date changes.
3. A role/title should normally be under 8 words. Do not use sentences as role titles.
4. Lines beginning with verbs such as led, managed, prepared, conducted, ensured, monitored, developed, implemented, coordinated, inspected, maintained, provided, supported, handled, improved, achieved, reduced, or increased are bullet points, not role titles.
5. Do not classify project names, skills, certifications, or education as experience.
6. If uncertain whether a line is a title or bullet, prefer bullet.
7. Preserve extra CV sections in additionalSections instead of dropping them.

CV TEXT:
${cleanText}`
                  }
                ]
              }
            ],
            text: {
              format: {
                type: "json_schema",
                name: "gcc_resume_builder_cv",
                schema: cvSchema,
                strict: true
              }
            },
            max_output_tokens: 12000
          })
        });

        const result = await aiResponse.json();

        if (!aiResponse.ok) {
          return jsonResponse({ error: result.error?.message || "OpenAI request failed." }, { status: 502 });
        }

        if (!result.output_text) {
          return jsonResponse({ error: "AI response did not include parseable output." }, { status: 502 });
        }

        return jsonResponse(JSON.parse(result.output_text));
      } catch (error) {
        return jsonResponse({ error: error.message || "CV parsing failed." }, { status: 500 });
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found" }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  }
};
