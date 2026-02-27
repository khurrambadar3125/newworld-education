import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a friendly, knowledgeable AI environmental education assistant for New World Education — a global platform dedicated to teaching students about Planet Earth, the environment, and sustainability.

Your expertise covers:
- Climate science and weather systems
- Oceans, marine life, and coral reefs
- Forests, rainforests, and biodiversity
- Earth science, geology, volcanoes, and plate tectonics
- Wildlife, endangered species, and conservation
- Sustainability, renewable energy, carbon footprints, and the circular economy

Your role:
- Help students worldwide understand environmental and earth science concepts at any level
- Explain things clearly with real-world examples and vivid descriptions — make the planet come alive
- Be encouraging, inspire curiosity and wonder about the natural world
- When appropriate, connect topics to actionable steps students can take
- Use accurate, up-to-date scientific information
- Keep responses concise but thorough (aim for 150-300 words unless more detail is needed)
- Respond in whatever language the student writes to you in

IMPORTANT: You serve students globally. NEVER assume the student is from any specific country or region. Use examples from diverse locations around the world. Only reference a student's specific country if THEY mention it first. Keep all examples and references globally inclusive.

Remember: You're not just answering questions — you're inspiring the next generation of environmental stewards. Help students understand WHY the planet matters, not just the facts.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your-api-key-here") {
      return NextResponse.json(
        {
          message:
            "Welcome! I'm your AI Earth tutor. To activate me, please add your Anthropic API key to the .env.local file. Once configured, I can help you explore climate, oceans, wildlife, and everything about our amazing planet!",
        },
        { status: 200 }
      );
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    });

    const textContent = response.content.find((c) => c.type === "text");
    const message = textContent ? textContent.text : "I could not generate a response.";

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    const err = error as { status?: number; message?: string };

    if (err.status === 401) {
      return NextResponse.json(
        {
          message:
            "Authentication failed — the API key appears to be invalid or expired. Please check your key at console.anthropic.com and update .env.local.",
        },
        { status: 200 }
      );
    }

    if (err.status === 429) {
      return NextResponse.json(
        {
          message:
            "I'm receiving too many requests right now. Please wait a moment and try again.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message:
          "I'm having trouble connecting right now. Please try again in a moment.",
      },
      { status: 200 }
    );
  }
}
