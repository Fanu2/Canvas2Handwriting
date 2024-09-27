import { useState, useRef } from 'react';
import FontSelector from './FontSelector';
import { jsPDF } from 'jspdf';

const HandwritingConverter = () => {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Dancing Script Regular');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pageSize, setPageSize] = useState('a4');
  const textAreaRef = useRef<HTMLDivElement>(null);

  // Function to wrap text and handle multi-line rendering
  const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  };

  const downloadAsImageOrPdf = (format: 'png' | 'pdf') => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const canvasWidth = 600;
      const canvasHeight = 800;
      const lineHeight = fontSize * 1.2;

      // Split text into pages
      const context = document.createElement('canvas').getContext('2d');
      if (context) {
        context.font = `${fontSize}px ${fontFamily}`;
        const wrappedLines = wrapText(context, text, 20, 40, canvasWidth - 40, lineHeight);
        const maxLinesPerPage = Math.floor((canvasHeight - 80) / lineHeight); // Adjust for margins
        const pageCount = Math.ceil(wrappedLines.length / maxLinesPerPage);

        if (format === 'png') {
          // Generate multiple PNGs
          for (let page = 0; page < pageCount; page++) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              console.error('Failed to get canvas context');
              continue; // Skip to the next iteration if context is null
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Set background color
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvasWidth, canvasHeight);

            // Set font styles
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = fontColor;

            const linesForPage = wrappedLines.slice(page * maxLinesPerPage, (page + 1) * maxLinesPerPage);
            let y = 40; // Starting y position

            linesForPage.forEach((line) => {
              context.fillText(line, 20, y);
              y += lineHeight;
            });

            // Download each page as a PNG
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `handwriting_page_${page + 1}.png`;
            link.click();
          }
        } else if (format === 'pdf') {
          // Create a new PDF
          const pdf = new jsPDF({ format: pageSize });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          for (let page = 0; page < pageCount; page++) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              console.error('Failed to get canvas context');
              continue; // Skip to the next iteration if context is null
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Set background color
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvasWidth, canvasHeight);

            // Set font styles
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = fontColor;

            const linesForPage = wrappedLines.slice(page * maxLinesPerPage, (page + 1) * maxLinesPerPage);
            let y = 40; // Starting y position

            linesForPage.forEach((line) => {
              context.fillText(line, 20, y);
              y += lineHeight;
            });

            const imgData = canvas.toDataURL('image/png');
            if (page > 0) {
              pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pageHeight - 20); // Adjust margins
          }

          pdf.save('handwriting.pdf');
        }
      }
    }
  };

  return (
    <div>
      <FontSelector setFontFamily={setFontFamily} />

      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Font Color:</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>

      <div>
        <label>Background Color:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      <div>
        <label>Page Size:</label>
        <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
      </div>

      <div
        ref={textAreaRef}
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: fontColor,
          backgroundColor: backgroundColor,
          width: '100%',
          height: '200px',
          padding: '10px',
          border: '1px solid #ddd',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          margin: '20px 0',
        }}
        contentEditable
        onInput={(e) => setText(e.currentTarget.textContent || '')}
      >
        {text}
      </div>

      <button onClick={() => downloadAsImageOrPdf('png')}>Download as PNG</button>
      <button onClick={() => downloadAsImageOrPdf('pdf')}>Download as PDF</button>
    </div>
  );
};

export default HandwritingConverter;
