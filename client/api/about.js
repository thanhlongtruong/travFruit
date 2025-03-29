export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thong tin ve travtruit</title>
    </head>
    <body>
      <h1>Trang thong tin ve travfruit</h1>
      <p>Day la trang About cua website.</p>
      <a href="/">Quay lai trang chu</a>
    </body>
    </html>
  `);
}
