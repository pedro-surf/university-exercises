import type { Homework } from "../data/homeworkMock";

const SCALE = 2;
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const pieces = breakWord(ctx, word, maxWidth);
      for (const piece of pieces) {
        const next = line ? `${line} ${piece}` : piece;
        if (line && ctx.measureText(next).width > maxWidth) {
          lines.push(line);
          line = piece;
        } else {
          line = next;
        }
      }
    }
    if (line) lines.push(line);
  }
  return lines.length > 0 ? lines : [""];
}

function breakWord(ctx: CanvasRenderingContext2D, word: string, maxWidth: number) {
  if (ctx.measureText(word).width <= maxWidth) return [word];
  const parts: string[] = [];
  let current = "";
  for (const char of word) {
    const next = current + char;
    if (current && ctx.measureText(next).width > maxWidth) {
      parts.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function paintText(text: string, fontPx: number, weight: string, color: string, maxWidth: number) {
  const font = `${weight} ${fontPx}px ${FONT}`;
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("Could not prepare the PDF.");
  measure.font = font;
  const lines = wrapLines(measure, text, maxWidth);
  const lineHeight = Math.round(fontPx * 1.4);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(maxWidth * SCALE);
  canvas.height = Math.max(lineHeight, lines.length * lineHeight) * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the PDF.");
  ctx.scale(SCALE, SCALE);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  lines.forEach((line, index) => ctx.fillText(line, 0, index * lineHeight));
  return canvas;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read a screenshot for the PDF."));
    image.src = url;
  });
}

async function paintShot(url: string, maxWidth: number, maxHeight: number) {
  const image = await loadImage(url);
  const naturalWidth = image.naturalWidth || 800;
  const naturalHeight = image.naturalHeight || 500;
  const ratio = naturalWidth / naturalHeight;
  let width = maxWidth;
  let height = width / ratio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * SCALE));
  canvas.height = Math.max(1, Math.round(height * SCALE));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw a screenshot for the PDF.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, width, height };
}

function fileName(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "homework"}.pdf`;
}

export async function downloadHomeworkPdf(homework: Homework) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const bottom = pageHeight - margin;
  let y = margin;

  const place = (canvas: HTMLCanvasElement, width: number, height: number) => {
    if (y > margin && y + height > bottom) {
      doc.addPage();
      y = margin;
    }
    doc.addImage(canvas.toDataURL("image/png"), "PNG", margin, y, width, height);
    y += height;
  };

  const title = paintText(homework.text, 22, "700", "#18181b", contentWidth);
  place(title, contentWidth, title.height / SCALE);
  y += 16;

  for (let index = 0; index < homework.screenshots.length; index += 1) {
    const shot = homework.screenshots[index];
    const description = shot.instructions.trim() || shot.name;
    const label = paintText(`${index + 1}. ${description}`, 13, "400", "#18181b", contentWidth);
    const labelHeight = label.height / SCALE;
    const image = await paintShot(shot.url, contentWidth, 300);
    const blockHeight = labelHeight + 10 + image.height;
    if (y > margin && y + blockHeight > bottom && blockHeight <= pageHeight - margin * 2) {
      doc.addPage();
      y = margin;
    }
    doc.addImage(label.toDataURL("image/png"), "PNG", margin, y, contentWidth, labelHeight);
    y += labelHeight + 10;
    if (y > margin && y + image.height > bottom) {
      doc.addPage();
      y = margin;
    }
    doc.addImage(image.canvas.toDataURL("image/jpeg", 0.92), "JPEG", margin, y, image.width, image.height);
    y += image.height + 22;
  }

  doc.save(fileName(homework.text));
}
