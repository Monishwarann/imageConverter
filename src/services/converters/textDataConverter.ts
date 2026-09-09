import { marked } from 'marked';
import DOMPurify from 'dompurify';
import * as jsYaml from 'js-yaml';
import { jsPDF } from 'jspdf';
import type { ConversionOptions } from '../../types';

/**
 * Text & Data Format Converter
 */
export async function convertTextData(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const target = targetFormat.toUpperCase();

  const textContent = await file.text();

  // 1. Markdown -> HTML
  if (target === 'HTML') {
    const rawHtml = await marked.parse(textContent);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    const fullDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${originalName}</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; }
    code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
    pre { background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
${cleanHtml}
</body>
</html>`;
    return {
      blob: new Blob([fullDoc], { type: 'text/html;charset=utf-8' }),
      fileName: `${originalName}.html`,
    };
  }

  // 2. Markdown / HTML / TXT -> PDF
  if (target === 'PDF') {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(textContent, 180);
    doc.text(lines, 14, 15);
    return {
      blob: doc.output('blob'),
      fileName: `${originalName}.pdf`,
    };
  }

  // 3. Markdown / HTML / TXT -> DOCX
  if (target === 'DOCX') {
    const htmlBody = await marked.parse(textContent);
    const docxContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>${originalName}</title></head>
<body style="font-family: Arial, sans-serif; font-size: 11pt;">
  ${DOMPurify.sanitize(htmlBody)}
</body>
</html>`;
    return {
      blob: new Blob([docxContent], { type: 'application/msword;charset=utf-8' }),
      fileName: `${originalName}.docx`,
    };
  }

  // 4. JSON -> XML
  if (target === 'XML') {
    let parsedObj: any = {};
    try {
      parsedObj = JSON.parse(textContent);
    } catch {
      parsedObj = { content: textContent };
    }
    const xmlContent = jsonToXml(parsedObj, 'root');
    return {
      blob: new Blob([xmlContent], { type: 'application/xml;charset=utf-8' }),
      fileName: `${originalName}.xml`,
    };
  }

  // 5. JSON -> YAML / YML
  if (target === 'YAML' || target === 'YML') {
    let parsedObj: any = {};
    try {
      parsedObj = JSON.parse(textContent);
    } catch {
      parsedObj = { text: textContent };
    }
    const yamlContent = jsYaml.dump(parsedObj);
    return {
      blob: new Blob([yamlContent], { type: 'application/x-yaml;charset=utf-8' }),
      fileName: `${originalName}.yaml`,
    };
  }

  // 6. YAML / XML -> JSON
  if (target === 'JSON') {
    let jsonObj: any = {};
    try {
      if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        jsonObj = jsYaml.load(textContent);
      } else {
        jsonObj = JSON.parse(textContent);
      }
    } catch {
      jsonObj = { raw: textContent };
    }

    const indent = options.minify ? 0 : (options.indentation ?? 2);
    const formatted = JSON.stringify(jsonObj, null, indent);
    return {
      blob: new Blob([formatted], { type: 'application/json;charset=utf-8' }),
      fileName: `${originalName}.json`,
    };
  }

  // 7. Data Formatting & Minification
  if (target === 'FORMAT_PRETTY' || target === 'MINIFY') {
    try {
      const obj = JSON.parse(textContent);
      const output = target === 'MINIFY' ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
      return {
        blob: new Blob([output], { type: 'application/json;charset=utf-8' }),
        fileName: `${originalName}_formatted.json`,
      };
    } catch {
      // Fallback
    }
  }

  // Default TXT export
  return {
    blob: new Blob([textContent], { type: 'text/plain;charset=utf-8' }),
    fileName: `${originalName}.${target.toLowerCase()}`,
  };
}

function jsonToXml(obj: any, rootName: string = 'root'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
  
  function buildXml(data: any) {
    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            xml += `<${key}>`;
            buildXml(item);
            xml += `</${key}>`;
          });
        } else if (typeof data[key] === 'object') {
          xml += `<${key}>`;
          buildXml(data[key]);
          xml += `</${key}>`;
        } else {
          xml += `<${key}>${escapeXml(String(data[key]))}</${key}>`;
        }
      }
    } else {
      xml += escapeXml(String(data));
    }
  }

  buildXml(obj);
  xml += `</${rootName}>`;
  return xml;
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
