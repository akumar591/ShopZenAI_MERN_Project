import fs from "fs";
import fetch from "node-fetch";

const callGemini = async (model, base64Image, mimeType, API_KEY) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are an AI e-commerce product generator.

Your job is to analyze the image and generate product details.

IMPORTANT RULES:
- Ignore person, face, pose, and background
- Focus ONLY on the main product in the image
- Identify product type correctly (clothing, electronics, footwear, watch, beauty, grocery, etc.)
- Identify color, style, or key features

CATEGORY HANDLING:
- If clothing → follow gender style (men/women/kids)
- If electronics/audio → mention key usage (performance, quality, features)
- If footwear → mention comfort and style
- If watches → mention design and premium feel
- If beauty → mention skin care / cosmetic benefits
- If grocery → mention freshness, quality, or daily use

GENDER RULE (only for clothing):
- Men → masculine tone
- Women → elegant/stylish tone
- Kids → simple and playful tone

OUTPUT STYLE:
- Title: short, clean, product-focused
- Description: 1–2 lines, attractive and selling-focused
- Do NOT describe person or background
- Do NOT add extra explanation

Return ONLY JSON:

{
  "name": "",
  "description": ""
}
`,
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  return res.json();
};

export const scanImage = async (req, res) => {
  console.log("🔥 API HIT");

  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });
    const API_KEY = process.env.GEMINI_API_KEY;

    let data;

    // 🥇 PRIMARY (fast but sometimes busy)
    data = await callGemini(
      "gemini-2.5-flash",
      base64Image,
      req.file.mimetype,
      API_KEY
    );
    console.log("PRIMARY 👉", data);

    // 🥈 FALLBACK 1 (stable)
    if (data.error) {
      console.log("⚠️ fallback 1...");
      data = await callGemini(
        "gemini-2.0-flash",
        base64Image,
        req.file.mimetype,
        API_KEY
      );
    }

    // 🥉 FALLBACK 2 (most stable)
    if (data.error) {
      console.log("⚠️ fallback 2...");
      data = await callGemini(
        "gemini-flash-latest",
        base64Image,
        req.file.mimetype,
        API_KEY
      );
    }

    if (data.error) {
      return res.json({
        success: false,
        message: data.error.message,
      });
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW 👉", rawText);

    let parsed = { name: "", description: "" };

    try {
      const clean = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const match = clean.match(/\{[\s\S]*?\}/);

      if (match) parsed = JSON.parse(match[0]);
    } catch (err) {
      console.log("Parsing failed 👉", err);
    }

    fs.unlinkSync(imagePath);

    return res.json({
      success: true,
      result: {
        name: parsed.name || "Product Name",
        description: parsed.description || "No description available",
      },
    });
  } catch (err) {
    console.log("💥 ERROR 👉", err);

    return res.json({
      success: false,
      message: "AI image scan failed",
    });
  }
};