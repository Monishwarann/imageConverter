import type { ConversionHistoryItem, BatchStats } from '../types';

const STORAGE_KEY = 'convertx_conversion_history';

/**
 * Save a completed conversion item to local history
 */
export function saveToHistory(item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>): ConversionHistoryItem {
  const currentHistory = getHistory();
  const newItem: ConversionHistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
  };

  const updated = [newItem, ...currentHistory].slice(0, 100); // keep last 100 entries
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save conversion history to localStorage:', e);
  }
  return newItem;
}

/**
 * Get all conversion history records
 */
export function getHistory(): ConversionHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all local conversion history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear history:', e);
  }
}

/**
 * Calculate aggregate savings statistics
 */
export function calculateBatchStats(history: ConversionHistoryItem[]): BatchStats {
  const completedItems = history.filter((h) => h.status === 'completed');
  const totalFiles = history.length;
  const completed = completedItems.length;
  const failed = history.filter((h) => h.status === 'failed').length;

  const originalTotalSize = completedItems.reduce((acc, curr) => acc + curr.originalSize, 0);
  const convertedTotalSize = completedItems.reduce((acc, curr) => acc + curr.convertedSize, 0);
  const savedBytes = Math.max(0, originalTotalSize - convertedTotalSize);

  return {
    totalFiles,
    completed,
    failed,
    skipped: 0,
    originalTotalSize,
    convertedTotalSize,
    savedBytes,
  };
}
