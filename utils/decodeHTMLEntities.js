export const decodeHTMLEntities = (text) => {
  const entities = {
    "&amp;": "&",
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
  return text.replace(/&[#\w]+;/g, (match) => entities[match] || match);
};