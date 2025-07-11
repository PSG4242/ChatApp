import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "messages.json");

export default async function handler(req, res) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (req.method === "GET") {
    res.status(200).json({ messages: data.messages });
  } else if (req.method === "POST") {
    const { sender, text } = req.body;

    if (!sender || !text) return res.status(400).json({ error: "Invalid" });

    data.messages.push({ sender, text, time: new Date().toISOString() });

    // Keep only last 10 messages
    data.messages = data.messages.slice(-10);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
