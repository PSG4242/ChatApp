const fs = require("fs");
const path = require("path"); // ✅ THIS LINE WAS MISSING
const statusPath = path.join(__dirname, "..", "..", "status.json");


exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === "GET") {
    const data = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (method === "POST") {
    const { user, status } = JSON.parse(event.body);
    if (!user || !status)
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };

    let data = {};
    if (fs.existsSync(statusPath)) {
      data = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
    }

    data[user] = {
      status,
      lastSeen: status === "offline" ? new Date().toLocaleString() : null
    };

    fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
