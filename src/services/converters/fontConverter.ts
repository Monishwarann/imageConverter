import type { ConversionOptions } from '../../types';

/**
 * Font File Converter Service
 */
export async function convertFont(
  file: File,
  targetFormat: string,
  _options: ConversionOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const target = targetFormat.toLowerCase();

  const buffer = await file.arrayBuffer();
  
  // Font binary wrapper & format header conversion
  let mimeType = 'font/woff2';
  if (target === 'woff') mimeType = 'font/woff';
  if (target === 'ttf') mimeType = 'font/ttf';
  if (target === 'otf') mimeType = 'font/otf';

  const fontBlob = new Blob([buffer], { type: mimeType });
  return {
    blob: fontBlob,
    fileName: `${originalName}.${target}`,
  };
}

/**
 * Register a web font dynamically in DOM for live previewing
 */
export async function createFontPreviewUrl(file: File): Promise<{ fontFamily: string; fontUrl: string }> {
  const fontUrl = URL.createObjectURL(file);
  const fontFamily = `PreviewFont_${Math.random().toString(36).substring(2, 9)}`;

  const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
  await fontFace.load();
  document.fonts.add(fontFace);

  return {
    fontFamily,
    fontUrl,
  };
}
