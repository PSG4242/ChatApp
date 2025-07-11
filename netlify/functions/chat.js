const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "messages.json");

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === "GET") {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (method === "POST") {
    const { sender, receiver, text } = JSON.parse(event.body);
    if (!sender || !receiver || !text)
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };

    let data = { messages: [] };
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    data.messages.push({ sender, receiver, text, time: new Date().toISOString() });
    if (data.messages.length > 10) data.messages = data.messages.slice(-10);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  if (method === "DELETE") {
    const { receiver } = JSON.parse(event.body);
    let data = { messages: [] };
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    data.messages = data.messages.filter(msg => msg.receiver !== receiver);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
