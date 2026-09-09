import type { ConversionOptions } from '../../types';

export interface SubtitleItem {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

/**
 * Subtitle Converter Service
 */
export async function convertSubtitle(
  file: File,
  targetFormat: string,
  _options: ConversionOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const target = targetFormat.toUpperCase();

  const content = await file.text();
  const parsedItems = parseSubtitle(content, file.name);

  // 1. Convert to VTT
  if (target === 'VTT') {
    let vttText = `WEBVTT - Converted by ConvertX\n\n`;
    parsedItems.forEach((item, index) => {
      vttText += `${index + 1}\n`;
      vttText += `${formatVttTime(item.startTime)} --> ${formatVttTime(item.endTime)}\n`;
      vttText += `${item.text}\n\n`;
    });
    return {
      blob: new Blob([vttText], { type: 'text/vtt;charset=utf-8' }),
      fileName: `${originalName}.vtt`,
    };
  }

  // 2. Convert to SRT
  if (target === 'SRT') {
    let srtText = ``;
    parsedItems.forEach((item, index) => {
      srtText += `${index + 1}\n`;
      srtText += `${formatSrtTime(item.startTime)} --> ${formatSrtTime(item.endTime)}\n`;
      srtText += `${item.text}\n\n`;
    });
    return {
      blob: new Blob([srtText], { type: 'text/plain;charset=utf-8' }),
      fileName: `${originalName}.srt`,
    };
  }

  // 3. Convert to TXT (Clean Transcript)
  if (target === 'TXT') {
    const txtText = parsedItems.map((item) => item.text).join('\n');
    return {
      blob: new Blob([txtText], { type: 'text/plain;charset=utf-8' }),
      fileName: `${originalName}.txt`,
    };
  }

  // Default fallback SRT
  let srtFallback = ``;
  parsedItems.forEach((item, index) => {
    srtFallback += `${index + 1}\n${item.startTime} --> ${item.endTime}\n${item.text}\n\n`;
  });
  return {
    blob: new Blob([srtFallback], { type: 'text/plain;charset=utf-8' }),
    fileName: `${originalName}.${target.toLowerCase()}`,
  };
}

function parseSubtitle(content: string, _fileName: string): SubtitleItem[] {
  const items: SubtitleItem[] = [];
  const blocks = content.replace(/\r\n/g, '\n').split('\n\n');

  let idCounter = 1;
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length >= 2) {
      const timeLineIndex = lines[0].includes('-->') ? 0 : 1;
      if (lines[timeLineIndex] && lines[timeLineIndex].includes('-->')) {
        const parts = lines[timeLineIndex].split('-->');
        const startTime = parts[0].trim();
        const endTime = parts[1].trim();
        const text = lines.slice(timeLineIndex + 1).join('\n');

        items.push({
          id: idCounter++,
          startTime,
          endTime,
          text,
        });
      }
    }
  }

  return items;
}

function formatVttTime(timeStr: string): string {
  return timeStr.replace(',', '.');
}

function formatSrtTime(timeStr: string): string {
  return timeStr.replace('.', ',');
}
