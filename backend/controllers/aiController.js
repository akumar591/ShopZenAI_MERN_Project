import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const scanImage = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // 🔹 Read image as base64
    const base64Image = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    // 🔹 Convert to data URL (VERY IMPORTANT)
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are an expert e-commerce product analyst.

Analyze the product image and return ONLY valid JSON in this format:

{
  "name": "",
  "description": "",
  "category": "",
  "subCategory": ""
}

Do NOT add explanations or extra text.
              `,
            },
            {
              type: "input_image",
              image_url: imageDataUrl, // ✅ CORRECT
            },
          ],
        },
      ],
    });

    const rawText =
      response.output_text ||
      response.output[0].content[0].text;

    console.log("AI RAW TEXT 👉", rawText);

    const parsed = JSON.parse(rawText);

    return res.json({
      success: true,
      result: parsed,
    });
  } catch (error) {
    console.error("AI ERROR 👉", error);
    return res.json({
      success: false,
      message: "AI image scan failed",
    });
  }
};
