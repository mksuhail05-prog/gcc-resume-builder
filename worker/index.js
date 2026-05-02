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
    }
  },
  required: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages"]
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
            model: "gpt-5.4-nano",
            instructions: "You extract CV/resume information for GCC job applications. Return strict JSON only. Preserve multiple experience, education, project, certification, and language entries. Do not invent missing details; use empty strings or empty arrays.",
            input: [
              {
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `Extract this CV into the requested JSON schema. Keep job titles as actual role titles, not achievements or bullet sentences. Put achievements inside bullets.\n\nCV TEXT:\n${cleanText}`
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
