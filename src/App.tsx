import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UniversalUploadZone } from './components/UniversalUploadZone';
import { ModeSelector } from './components/ModeSelector';
import { ConversionQueue } from './components/ConversionQueue';
import { BatchControls } from './components/BatchControls';
import { AdvancedSettingsModal } from './components/AdvancedSettingsModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { BatchSummaryModal } from './components/BatchSummaryModal';
import { HistoryView } from './components/HistoryView';
import { QuickToolsGrid } from './components/QuickToolsGrid';

// Dedicated Tool Pages for EACH purpose
import { ImageToolPage } from './pages/ImageToolPage';
import { PdfToolPage } from './pages/PdfToolPage';
import { DocumentToolPage } from './pages/DocumentToolPage';
import { SpreadsheetToolPage } from './pages/SpreadsheetToolPage';
import { PresentationToolPage } from './pages/PresentationToolPage';
import { VectorToolPage } from './pages/VectorToolPage';
import { TextDataToolPage } from './pages/TextDataToolPage';
import { EbookToolPage } from './pages/EbookToolPage';
import { ArchiveToolPage } from './pages/ArchiveToolPage';
import { FontToolPage } from './pages/FontToolPage';
import { SubtitleToolPage } from './pages/SubtitleToolPage';
import { OcrToolPage } from './pages/OcrToolPage';

import type { FileItem, FormatCategory, ConversionMode, ConversionOptions } from './types';
import { executeFileConversion } from './services/workerQueue';
import { createZipArchive } from './services/converters/archiveConverter';
import { convertImagesToPdf } from './services/converters/imageConverter';
import { mergePdfFiles } from './services/converters/pdfConverter';
import { getHistory } from './services/historyStorage';

export function App() {
  const [activeCategory, setActiveCategory] = useState<FormatCategory>('universal');
  const [mode, setMode] = useState<ConversionMode>('multi');
  const [queue, setQueue] = useState<FileItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [settingsItem, setSettingsItem] = useState<FileItem | null>(null);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // History state
  const [history, setHistory] = useState(getHistory());

  const refreshHistory = () => {
    setHistory(getHistory());
  };

  const handleFilesAdded = (newItems: FileItem[]) => {
    setQueue((prev) => [...prev, ...newItems]);
    setSelectedIds((prev) => [...prev, ...newItems.map((i) => i.id)]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedIds(queue.map((f) => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleUpdateOutputFormat = (id: string, format: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedOutputFormat: format } : item))
    );
  };

  const handleApplyFormatToAll = (format: string) => {
    if (!format) return;
    setQueue((prev) =>
      prev.map((item) => {
        if (item.availableOutputs.includes(format)) {
          return { ...item, selectedOutputFormat: format };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleClearCompleted = () => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
    setSelectedIds([]);
  };

  const handleClearAll = () => {
    setQueue([]);
    setSelectedIds([]);
  };

  const handleSaveOptions = (id: string, options: ConversionOptions) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customOptions: options } : item))
    );
  };

  // Process selected or all files in parallel worker queue
  const processItems = async (itemsToProcess: FileItem[]) => {
    if (itemsToProcess.length === 0 || isProcessing) return;

    setIsProcessing(true);

    // If Merge Mode is selected, merge files into 1 PDF
    if (mode === 'merge' && itemsToProcess.length > 1) {
      const firstItem = itemsToProcess[0];
      setQueue((prev) =>
        prev.map((i) => (itemsToProcess.some((p) => p.id === i.id) ? { ...i, status: 'processing', progress: 50 } : i))
      );

      try {
        const rawFiles = itemsToProcess.map((i) => i.file);
        let mergedResult: { blob: Blob; fileName: string };

        const allPdfs = rawFiles.every((f) => f.type.includes('pdf') || f.name.endsWith('.pdf'));
        if (allPdfs) {
          mergedResult = await mergePdfFiles(rawFiles, 'merged-document.pdf');
        } else {
          mergedResult = await convertImagesToPdf(rawFiles, {}, 'merged-document.pdf');
        }

        setQueue((prev) =>
          prev.map((i) =>
            i.id === firstItem.id
              ? {
                  ...i,
                  status: 'completed',
                  progress: 100,
                  convertedBlob: mergedResult.blob,
                  convertedName: mergedResult.fileName,
                  convertedSize: mergedResult.blob.size,
                }
              : { ...i, status: 'completed', progress: 100 }
          )
        );
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((i) => (itemsToProcess.some((p) => p.id === i.id) ? { ...i, status: 'failed', error: err.message } : i))
        );
      }

      setIsProcessing(false);
      setShowSummaryModal(true);
      refreshHistory();
      return;
    }

    // Individual Parallel Queue Processing
    for (const item of itemsToProcess) {
      setQueue((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i))
      );

      try {
        const result = await executeFileConversion(item, (prog) => {
          setQueue((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: prog } : i))
          );
        });

        setQueue((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'completed',
                  progress: 100,
                  convertedBlob: result.blob,
                  convertedName: result.fileName,
                  convertedSize: result.size,
                }
              : i
          )
        );
      } catch (error: any) {
        setQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'failed', error: error.message } : i))
        );
      }
    }

    setIsProcessing(false);
    setShowSummaryModal(true);
    refreshHistory();
  };

  const handleConvertAll = () => {
    processItems(queue.filter((q) => q.status !== 'completed'));
  };

  const handleConvertSelected = () => {
    const selectedItems = queue.filter((q) => selectedIds.includes(q.id) && q.status !== 'completed');
    processItems(selectedItems);
  };

  const handleRetryItem = (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (item) processItems([item]);
  };

  const handleDownloadItem = (item: FileItem) => {
    if (!item.convertedBlob) return;
    const url = URL.createObjectURL(item.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.convertedName || item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    const completed = queue.filter((q) => q.status === 'completed' && q.convertedBlob);
    if (completed.length === 0) return;

    const filesToZip = completed.map((item) => ({
      blob: item.convertedBlob!,
      fileName: item.convertedName || item.name,
      category: item.category,
    }));

    const zipResult = await createZipArchive(filesToZip, { preserveStructure: true }, 'convertx-converted-files.zip');

    const url = URL.createObjectURL(zipResult.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipResult.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedCount = queue.filter((q) => q.status === 'completed').length;

  const sharedProps = {
    queue,
    selectedIds,
    isProcessing,
    mode,
    onFilesAdded: handleFilesAdded,
    onToggleSelect: handleToggleSelect,
    onSelectAll: handleSelectAll,
    onConvertAll: handleConvertAll,
    onConvertSelected: handleConvertSelected,
    onDownloadAllZip: handleDownloadAllZip,
    onClearCompleted: handleClearCompleted,
    onClearAll: handleClearAll,
    onApplyFormatToAll: handleApplyFormatToAll,
    onUpdateOutputFormat: handleUpdateOutputFormat,
    onRemoveItem: handleRemoveItem,
    onRetryItem: handleRetryItem,
    onOpenPreview: setPreviewItem,
    onOpenSettings: setSettingsItem,
    onDownloadItem: handleDownloadItem,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        queueCount={queue.length}
        completedCount={completedCount}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Category Sidebar */}
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* Right Main Content Panel */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {activeCategory === 'history' && (
            <HistoryView history={history} onRefresh={refreshHistory} />
          )}

          {activeCategory === 'image' && (
            <ImageToolPage {...sharedProps} />
          )}

          {activeCategory === 'pdf' && (
            <PdfToolPage {...sharedProps} />
          )}

          {activeCategory === 'document' && (
            <DocumentToolPage {...sharedProps} />
          )}

          {activeCategory === 'spreadsheet' && (
            <SpreadsheetToolPage {...sharedProps} />
          )}

          {activeCategory === 'presentation' && (
            <PresentationToolPage {...sharedProps} />
          )}

          {activeCategory === 'vector' && (
            <VectorToolPage {...sharedProps} />
          )}

          {activeCategory === 'text_data' && (
            <TextDataToolPage {...sharedProps} />
          )}

          {activeCategory === 'ebook' && (
            <EbookToolPage {...sharedProps} />
          )}

          {activeCategory === 'archive' && (
            <ArchiveToolPage {...sharedProps} />
          )}

          {activeCategory === 'font' && (
            <FontToolPage {...sharedProps} />
          )}

          {activeCategory === 'subtitle' && (
            <SubtitleToolPage {...sharedProps} />
          )}

          {activeCategory === 'ocr' && (
            <OcrToolPage {...sharedProps} />
          )}

          {activeCategory === 'universal' && (
            <>
              {/* Universal Dropzone */}
              <UniversalUploadZone onFilesAdded={handleFilesAdded} activeCategory={activeCategory} />

              {/* Mode Selector */}
              {queue.length > 0 && (
                <ModeSelector mode={mode} setMode={setMode} fileCount={queue.length} />
              )}

              {/* Batch Controls */}
              {queue.length > 0 && (
                <BatchControls
                  files={queue}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onConvertAll={handleConvertAll}
                  onConvertSelected={handleConvertSelected}
                  onDownloadAllZip={handleDownloadAllZip}
                  onClearCompleted={handleClearCompleted}
                  onClearAll={handleClearAll}
                  onApplyFormatToAll={handleApplyFormatToAll}
                  isProcessing={isProcessing}
                  mode={mode}
                />
              )}

              {/* Queue List */}
              {queue.length > 0 && (
                <ConversionQueue
                  files={queue}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onUpdateOutputFormat={handleUpdateOutputFormat}
                  onRemoveItem={handleRemoveItem}
                  onRetryItem={handleRetryItem}
                  onOpenPreview={setPreviewItem}
                  onOpenSettings={setSettingsItem}
                  onDownloadItem={handleDownloadItem}
                />
              )}

              {/* Popular Tools Shortcuts Grid */}
              {queue.length === 0 && (
                <QuickToolsGrid setActiveCategory={setActiveCategory} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AdvancedSettingsModal
        item={settingsItem}
        onClose={() => setSettingsItem(null)}
        onSave={handleSaveOptions}
      />

      <FilePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDownload={handleDownloadItem}
      />

      {showSummaryModal && (
        <BatchSummaryModal
          files={queue}
          onClose={() => setShowSummaryModal(false)}
          onDownloadZip={handleDownloadAllZip}
        />
      )}
    </div>
  );
}

export default App;
