import { useState, useRef } from 'react';
import FontSelector from './FontSelector';
import { jsPDF } from 'jspdf';

const HandwritingConverter = () => {
  const [text, setText] = useState(''); // State for the written text
  const [fontFamily, setFontFamily] = useState('Dancing Script Regular'); // Font selection
  const [fontSize, setFontSize] = useState(24); // Font size
  const [fontColor, setFontColor] = useState('#000000'); // Font color
  const textAreaRef = useRef<HTMLDivElement>(null); // Reference for the text area to capture

  // Function to download the text as an image or PDF
  const downloadAsImageOrPdf = (format: 'png' | 'pdf') => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        const canvasWidth = textArea.offsetWidth;
        const canvasHeight = textArea.offsetHeight;

        // Set canvas dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Apply font styles on the canvas
        context.font = `${fontSize}px ${fontFamily}`;
        context.fillStyle = fontColor;
        context.fillText(text, 10, 50); // Positioning the text

        if (format === 'png') {
          // Download the canvas content as an image (PNG)
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'handwriting.png';
          link.click();
        } else if (format === 'pdf') {
          // Convert the canvas to a PDF
          const pdf = new jsPDF();
          const imgData = canvas.toDataURL('image/png');

          // Add image to the PDF
          pdf.addImage(imgData, 'PNG', 10, 10, canvasWidth / 4, canvasHeight / 4); // Adjust dimensions as per your need
          
          // If there is more content, add another page
          if (textArea.scrollHeight > textArea.offsetHeight) {
            pdf.addPage();
            // You can add additional logic here for handling pagination
          }

          pdf.save('handwriting.pdf'); // Download as PDF
        }
      }
    }
  };

  return (
    <div>
      {/* Font Selector Dropdown */}
      <FontSelector setFontFamily={setFontFamily} />

      {/* Input to change font size */}
      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </div>

      {/* Input to change font color */}
      <div>
        <label>Font Color:</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>

      {/* Textarea where the font is dynamically applied */}
      <div
        ref={textAreaRef}
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: fontColor,
          width: '100%',
          height: '200px',
          padding: '10px',
          border: '1px solid #ddd',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
        }}
        contentEditable // To allow typing directly
        onInput={(e) => setText(e.currentTarget.textContent || '')} // Capture the text
      >
        {text}
      </div>

      {/* Buttons to download */}
      <button onClick={() => downloadAsImageOrPdf('png')}>Download as PNG</button>
      <button onClick={() => downloadAsImageOrPdf('pdf')}>Download as PDF</button>
    </div>
  );
};

export default HandwritingConverter;
