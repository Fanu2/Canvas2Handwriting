import { useState } from 'react';

const FontSelector = ({ setFontFamily }: { setFontFamily: (font: string) => void }) => {
  const [selectedFont, setSelectedFont] = useState('Dancing Script Regular');

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(event.target.value);
    setFontFamily(event.target.value);
  };

  return (
    <select value={selectedFont} onChange={handleFontChange}>
      <option value="Dancing Script Bold">Dancing Script Bold</option>
      <option value="Dancing Script Medium">Dancing Script Medium</option>
      <option value="Dancing Script Regular">Dancing Script Regular</option>
      <option value="Dancing Script SemiBold">Dancing Script SemiBold</option>
      <option value="Dancing Script Variable">Dancing Script Variable</option>
      <option value="Geist VF">Geist VF</option>
      <option value="Geist Mono VF">Geist Mono VF</option>
      <option value="Kalam Bold">Kalam Bold</option>
      <option value="Kalam Light">Kalam Light</option>
      <option value="Kalam Regular">Kalam Regular</option>
      <option value="Patrick Hand">Patrick Hand</option>
      <option value="Tillana Bold">Tillana Bold</option>
      <option value="Tillana ExtraBold">Tillana ExtraBold</option>
      <option value="Tillana Medium">Tillana Medium</option>
      <option value="Tillana Regular">Tillana Regular</option>
      <option value="Tillana SemiBold">Tillana SemiBold</option>
    </select>
  );
};

export default FontSelector;
