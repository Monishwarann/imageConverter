import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { ConversionOptions } from '../../types';

/**
 * Spreadsheet format converter using SheetJS
 */
export async function convertSpreadsheet(
  file: File,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const target = targetFormat.toUpperCase();

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  const sheetName = workbook.SheetNames[options.sheetIndex || 0] || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 1. XLSX / CSV / TSV / ODS -> CSV
  if (target === 'CSV') {
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet, { FS: options.csvDelimiter || ',' });
    return {
      blob: new Blob([csvOutput], { type: 'text/csv;charset=utf-8' }),
      fileName: `${originalName}.csv`,
    };
  }

  // 2. XLSX / CSV / TSV / ODS -> TSV
  if (target === 'TSV') {
    const tsvOutput = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' });
    return {
      blob: new Blob([tsvOutput], { type: 'text/tab-separated-values;charset=utf-8' }),
      fileName: `${originalName}.tsv`,
    };
  }

  // 3. XLSX / CSV -> JSON
  if (target === 'JSON') {
    const jsonOutput = XLSX.utils.sheet_to_json(worksheet);
    const formattedJson = JSON.stringify(jsonOutput, null, options.indentation || 2);
    return {
      blob: new Blob([formattedJson], { type: 'application/json;charset=utf-8' }),
      fileName: `${originalName}.json`,
    };
  }

  // 4. CSV / TSV / ODS -> XLSX
  if (target === 'XLSX') {
    const outBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return {
      blob: new Blob([outBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      fileName: `${originalName}.xlsx`,
    };
  }

  // 5. CSV / XLSX -> PDF
  if (target === 'PDF') {
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(14);
    doc.text(`Sheet: ${sheetName}`, 14, 15);

    if (jsonData.length > 0) {
      const headers = Object.keys(jsonData[0]);
      let y = 25;
      doc.setFontSize(10);
      doc.text(headers.join(' | '), 14, y);
      y += 8;

      for (let i = 0; i < Math.min(jsonData.length, 30); i++) {
        const rowValues = headers.map((h) => String(jsonData[i][h] ?? ''));
        doc.text(rowValues.join(' | '), 14, y);
        y += 6;
        if (y > 190) {
          doc.addPage();
          y = 15;
        }
      }
    }

    const pdfBlob = doc.output('blob');
    return {
      blob: pdfBlob,
      fileName: `${originalName}.pdf`,
    };
  }

  // Default export as XLSX
  const outBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return {
    blob: new Blob([outBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    fileName: `${originalName}.${target.toLowerCase()}`,
  };
}
