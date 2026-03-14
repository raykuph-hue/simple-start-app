import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { businessName, businessType, description } = await req.json()

    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY")

    const prompt = `
Create a modern small business website.

Business name: ${businessName}
Business type: ${businessType}
Description: ${description}

Return ONLY JSON in this format:

{
 "site": {
   "name": "Business Name",
   "tagline": "short tagline",
   "pages": {
     "index.html": "...",
     "about.html": "...",
     "services.html": "...",
     "contact.html": "...",
     "blog.html": "..."
   }
 }
}

Rules:
- Tailwind CSS CDN
- Mobile responsive
- Include navbar linking all pages
- Include hero section
- Include CTA
- Use Unsplash images
- Include SEO meta tags
- No markdown
- Only JSON
`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are an expert web developer." },
          { role: "user", content: prompt }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const data = await response.json()

    let content = data.choices[0].message.content
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim()

    const parsed = JSON.parse(content)

    return new Response(
      JSON.stringify(parsed),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    )
  }
})