import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore — JS module
import { checkContentViolation, checkExcludedAuthors } from '../../utils/contentProtection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Content protection — check last user message for violations
    const body = req.body;
    const lastUserMsg = (body.messages || []).filter((m: any) => m.role === 'user').pop();
    if (lastUserMsg?.content) {
      const msgText = typeof lastUserMsg.content === 'string' ? lastUserMsg.content : '';
      const excludedResponse = checkExcludedAuthors(msgText);
      if (excludedResponse) {
        return res.status(200).json({ content: [{ type: 'text', text: excludedResponse }] });
      }
      const violation = checkContentViolation(msgText);
      if (violation.violation) {
        return res.status(200).json({ content: [{ type: 'text', text: violation.response }] });
      }
    }

    // Check if request contains PDF documents to enable PDF support
    const hasPdf = JSON.stringify(body.messages || []).includes('"type":"document"');

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    };
    if (hasPdf) {
      headers["anthropic-beta"] = "pdfs-2024-09-25";
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to reach AI" });
  }
}
