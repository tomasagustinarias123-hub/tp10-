const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.post("/api/comando", (req, res) => {
  const { comando } = req.body;
  console.log("Comando recibido desde la web:", comando);

  res.json({
    ok: true,
    comandoRecibido: comando,
    estado: `Simulación OK: el robot ejecutó "${comando}"`,
    timestamp: new Date().toLocaleTimeString(),
  });
});

app.get("/api/video", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace; boundary=frame",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const frameVacio = Buffer.from(
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
    "base64"
  );

  const intervalo = setInterval(() => {
    res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${frameVacio.length}\r\n\r\n`);
    res.write(frameVacio);
    res.write("\r\n");
  }, 500);

  req.on("close", () => clearInterval(intervalo));
});

app.listen(PORT, () => {
  console.log(`Simulador YoLo corriendo en http://localhost:${PORT}`);
});