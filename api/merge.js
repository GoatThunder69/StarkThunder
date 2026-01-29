export default {
  async fetch(request) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (!q) {
      return new Response(JSON.stringify({
        status: false,
        message: "q parameter missing"
      }), { status: 400 });
    }

    const api1 =
      "https://api.paanel.shop/numapi.php?action=api&key=thunder&test1=" +
      encodeURIComponent(q);

    const api2 =
      "https://api.x10.network/numapi.php?action=api&key=thunder&test1=" +
      encodeURIComponent(q);

    try {
      // ⚡ parallel fetch (FAST)
      const [r1, r2] = await Promise.all([
        fetch(api1),
        fetch(api2)
      ]);

      let t1 = await r1.text();
      let t2 = await r2.text();

      const clean = (txt) =>
        txt
          .replace(/@\S+/g, "[hidden]")
          .replace(/https?:\/\/\S+/gi, "[hidden]")
          .replace(/(t\.me|telegram\.me)\/\S+/gi, "[hidden]")
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi, "[hidden]");

      t1 = clean(t1);
      t2 = clean(t2);

      const finalResult = `
===== API 1 RESULT =====
${t1}

===== API 2 RESULT =====
${t2}
`;

      return new Response(finalResult.trim(), {
        headers: {
          "Content-Type": "application/json"
        }
      });

    } catch (e) {
      return new Response(JSON.stringify({
        status: false,
        error: "Merged API failed"
      }), { status: 500 });
    }
  }
};
