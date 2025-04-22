const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const testimonialsDir = path.join(process.cwd(), "public", "testimonials");

// Asegurarse de que el directorio existe
if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir, { recursive: true });
}

const testimonials = [
  { name: "maria", color: "#FF6B6B" },
  { name: "juan", color: "#4ECDC4" },
  { name: "ana", color: "#45B7D1" },
];

testimonials.forEach(({ name, color }) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  // Fondo
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 200, 200);

  // Círculo para la silueta
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(100, 80, 40, 0, Math.PI * 2);
  ctx.fill();

  // Cuerpo
  ctx.beginPath();
  ctx.moveTo(60, 120);
  ctx.quadraticCurveTo(100, 180, 140, 120);
  ctx.fill();

  // Guardar la imagen
  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync(path.join(testimonialsDir, `${name}.jpg`), buffer);
});
