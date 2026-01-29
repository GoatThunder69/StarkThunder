export default async function handler(req, res) {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      status: false,
      message: "q parameter missing"
    });
  }

  const apiUrl =
    "https://api.paanel.shop/numapi.php?action=api&key=thunder&test1=" +
    encodeURIComponent(q);

  try {
    const r = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    let text = await r.text();

    // 🔥 HIDE ALL @mentions EXCEPT @SxThunder
    text = text.replace(/@(?!SxThunder)\S+/gi, "[hidden]");

    // 🔥 HIDE LINKS
    text = text.replace(/https?:\/\/\S+/gi, "[hidden]");
    text = text.replace(/(t\.me|telegram\.me)\/\S+/gi, "[hidden]");

    // 🔥 HIDE EMAILS
    text = text.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi,
      "[hidden]"
    );

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text.trim());

  } catch (err) {
    res.status(500).json({
      status: false,
      error: "API fetch failed"
    });
  }
}
