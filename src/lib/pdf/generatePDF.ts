import { BookPage } from '@/types'

export function buildBookHTML(
  pages: BookPage[],
  title: string,
  format: 'digital' | 'print',
  bookFormat: 'square' | 'portrait'
): string {
  const isSquare = bookFormat === 'square'
  const pageWidth = isSquare ? '200mm' : '210mm'
  const pageHeight = isSquare ? '200mm' : '297mm'

  const pagesHTML = pages
    .map(
      (page) => `
    <div class="book-page">
      <div class="image-area">
        ${page.imageUrl ? `<img src="${page.imageUrl}" alt="עמוד ${page.pageNumber}" />` : '<div class="no-image">🎨</div>'}
      </div>
      <div class="text-area">
        <p>${page.text}</p>
      </div>
      <div class="page-num">${page.pageNumber}</div>
    </div>
  `
    )
    .join('')

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Heebo', 'Arial Hebrew', sans-serif;
    background: white;
    direction: rtl;
  }

  .book-page {
    width: ${pageWidth};
    height: ${pageHeight};
    page-break-after: always;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #FFF9F0;
    border-radius: 8mm;
    overflow: hidden;
  }

  .image-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FFE0DC 0%, #FFD49E 100%);
  }

  .image-area img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    font-size: 60pt;
    opacity: 0.3;
  }

  .text-area {
    padding: 8mm 10mm;
    background: white;
    border-top: 3px solid #FF6B6B22;
    min-height: 30mm;
    max-height: 40mm;
    display: flex;
    align-items: center;
  }

  .text-area p {
    font-size: ${isSquare ? '16pt' : '14pt'};
    line-height: 1.6;
    color: #1a1a2e;
    font-weight: 500;
    text-align: right;
  }

  .page-num {
    position: absolute;
    bottom: 3mm;
    left: 5mm;
    font-size: 8pt;
    color: #ccc;
  }

  @media print {
    body { margin: 0; }
    .book-page { page-break-after: always; border-radius: 0; }
  }
</style>
</head>
<body>
  <!-- Cover -->
  <div class="book-page" style="justify-content: center; align-items: center; background: linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%);">
    <div style="text-align: center; color: white; padding: 20mm;">
      <div style="font-size: 60pt; margin-bottom: 10mm;">📖</div>
      <h1 style="font-size: 28pt; font-weight: 900; line-height: 1.3;">${title}</h1>
    </div>
  </div>

  ${pagesHTML}

  <!-- Back Cover -->
  <div class="book-page" style="justify-content: center; align-items: center; background: linear-gradient(135deg, #9B59B6 0%, #FF6B6B 100%);">
    <div style="text-align: center; color: white; padding: 20mm;">
      <div style="font-size: 40pt; margin-bottom: 8mm;">✨</div>
      <p style="font-size: 16pt; font-weight: 600;">הספר שלי</p>
      <p style="font-size: 11pt; margin-top: 4mm; opacity: 0.8;">נוצר במיוחד עבורך</p>
    </div>
  </div>
</body>
</html>`
}
