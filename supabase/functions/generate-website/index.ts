import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, industry, description, pages, colorStyle, tone } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const colorPalettes: Record<string, string> = {
      modern: "Use a clean palette with deep navy (#1a1a2e), white (#ffffff), and a vibrant accent like electric blue (#00d4ff).",
      bold: "Use bold, vibrant colors like deep purple (#6c3ce9), hot pink (#ff2e63), and bright cyan (#00ffcc).",
      minimal: "Use a minimal palette with off-white (#fafafa), charcoal (#333333), and subtle gray accents.",
      warm: "Use warm, inviting colors like terracotta (#e07a5f), cream (#f4f1de), and sage green (#81b29a).",
      dark: "Use a dark professional palette with near-black (#0a0a0a), dark gray (#1a1a1a), and gold accents (#ffd700).",
      gradient: "Use modern gradients from purple (#667eea) to pink (#f6416c) with white text.",
    };

    const toneDescriptions: Record<string, string> = {
      professional: "Use formal, authoritative language that builds trust and credibility.",
      friendly: "Use casual, approachable language that feels warm and welcoming.",
      luxurious: "Use elegant, sophisticated language that conveys exclusivity and premium quality.",
      playful: "Use fun, energetic language with personality and humor.",
      trustworthy: "Use reliable, reassuring language that emphasizes stability and dependability.",
    };

    const prompt = `Generate a complete, modern, responsive single-page HTML website for a ${industry} business called "${businessName}".

Business description: ${description || "A professional " + industry + " company providing excellent services."}

Design requirements:
- ${colorPalettes[colorStyle] || colorPalettes.modern}
- The design should feel modern, clean, and professional
- Use CSS Grid and Flexbox for layout
- Include smooth hover transitions and subtle animations
- Mobile-responsive design
- Use system fonts or Google Fonts like Inter or Poppins

Tone: ${toneDescriptions[tone] || toneDescriptions.professional}

Include these sections:
1. Navigation bar with logo and links
2. Hero section with compelling headline, subheadline, and CTA button
3. Features/Services section with 3-4 key offerings
4. About section with company overview
5. Testimonials section with 2-3 customer quotes
6. Contact section with a simple contact form
7. Footer with copyright and social links

Requirements:
- Output only valid HTML with embedded CSS in a <style> tag
- Include all CSS inline within the <style> tag in the <head>
- Make it fully self-contained (no external dependencies except fonts)
- The HTML must be complete and render properly
- Add placeholder images using data URIs or gradient backgrounds
- Include Font Awesome CDN for icons if needed

Start with <!DOCTYPE html> and end with </html>. Output ONLY the HTML code, no explanations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert web developer who creates beautiful, modern, responsive HTML websites. You output only valid HTML code with embedded CSS. No markdown, no explanations, just clean HTML.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate website");
    }

    const data = await response.json();
    let html = data.choices?.[0]?.message?.content || "";

    // Clean up the HTML if it has markdown code blocks
    html = html.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    // Ensure it starts with DOCTYPE
    if (!html.toLowerCase().startsWith("<!doctype")) {
      html = "<!DOCTYPE html>\n" + html;
    }

    // Inject ads banner and watermark for free tier users
    const adsScript = `
    <div id="phosify-ads-banner" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1a1a2e,#16213e);padding:12px;text-align:center;z-index:9999;font-family:system-ui,sans-serif;">
      <span style="color:#fff;font-size:14px;">🚀 This site is powered by </span>
      <a href="https://phosify.app" target="_blank" style="color:#00d4ff;text-decoration:none;font-weight:bold;">Phosify</a>
      <span style="color:#fff;font-size:14px;"> — </span>
      <a href="https://phosify.app/auth?mode=signup" target="_blank" style="color:#00d4ff;text-decoration:none;">Create your own free website →</a>
    </div>`;

    const watermark = `
    <div id="phosify-watermark" style="position:fixed;bottom:60px;right:20px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);padding:8px 12px;border-radius:8px;z-index:9998;font-family:system-ui,sans-serif;">
      <span style="color:#00d4ff;font-size:12px;">Built with Phosify</span>
    </div>`;

    // Default to injecting ads (will be controlled by plan in the frontend/database)
    html = html.replace("</body>", `${adsScript}${watermark}</body>`);

    return new Response(
      JSON.stringify({ html, css: "" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-website:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
