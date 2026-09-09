<div align="center">

# ⚡ ConvertX

### *Convert Anything. Create Everything.*

An all-in-one, high-performance **Universal File Converter & Multi-Convert Engine** supporting Images, Documents, Spreadsheets, Presentations, PDFs, Vector Graphics, Archives, Text Files, Fonts, Subtitles, E-books, and AI OCR — running **100% client-side** in your browser for maximum privacy and zero latency.

[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

</div>

## ✨ Key Features

- 🪄 **Magic Byte File Auto-Detection**: Uses binary header signatures (`PNG`, `JPEG`, `PDF`, `ZIP`, `GIF`, `WEBP`, `BMP`, `TIFF`, `ICO`, `TTF`, `WOFF`, `WOFF2`) alongside MIME types and extension fallbacks for accurate format recognition.
- ⚡ **Multi-Convert & Batch Processing**: Process 1, 10, 50, or 100+ mixed-format files in a single session.
- 🎛️ **4 Flexible Conversion Modes**:
  - **Multi Convert**: Mixed file uploads with individual output format dropdowns per file.
  - **Batch Convert**: Convert all compatible queue items to a single selected output format.
  - **Merge to PDF**: Combine multiple images or PDF files into one clean PDF document.
  - **Single Convert**: Detailed single-file view with format-specific parameter tuning.
- 🔒 **100% Client-Side Privacy**: All file processing executes inside your browser memory using Canvas 2D, `pdf-lib`, `jsPDF`, `xlsx` (SheetJS), `JSZip`, `marked`, `DOMPurify`, and `tesseract.js` (OCR). No files are uploaded to third-party servers.
- 🎨 **Purpose-Built Category Tool Suites**: Dedicated UI pages with custom color themes, hero banners, format shortcut pills, and parameter presets for all 13 categories.
- 👁️ **Interactive Live Previews & Syntax Editor**: Inspect converted images, formatted JSON/XML/YAML/Markdown code, and live web font typeface previews.
- 📦 **Structured ZIP Download**: Download converted files individually or as a categorized `.zip` archive (`/images`, `/documents`, `/data`).
- 🎉 **Confetti Batch Summary Dashboard**: Visual completion modal showing files processed, original vs output size comparison, and space saved percentage.

---

## 📊 Complete Supported Format Compatibility Matrix

| Category | Input Formats | Supported Output Formats & Tools |
|---|---|---|
| **🖼️ Image Converter** | `JPG`, `JPEG`, `PNG`, `WEBP`, `GIF`, `BMP`, `TIFF`, `ICO`, `AVIF`, `HEIC` | `PNG`, `JPG`, `WEBP`, `AVIF`, `BMP`, `TIFF`, `ICO`, `PDF` *(with Quality Slider & Max Dimensions)* |
| **📄 PDF Toolkit** | `PDF` | `DOCX`, `TXT`, `HTML`, `JPG`, `PNG`, `WEBP`, `TIFF`, `SVG`, `PDF Merge`, `PDF Watermark`, `PDF Compress` |
| **📝 Document Tools** | `DOCX`, `DOC`, `DOT`, `RTF`, `TXT`, `HTML` | `PDF`, `TXT`, `HTML`, `RTF`, `DOCX` *(Preserving Headings & Layout)* |
| **📊 Spreadsheets** | `XLSX`, `XLS`, `CSV`, `TSV`, `ODS` | `CSV`, `TSV`, `XLSX`, `JSON`, `PDF` *(With Sheet Selection & Custom Delimiters)* |
| **📊 Presentations** | `PPTX`, `PPT`, `PPS`, `ODP` | `PDF`, `JPG`, `PNG`, `WEBP`, `SVG` *(One Image per Slide Export)* |
| **📐 Vector Graphics** | `SVG`, `EPS`, `AI` | `PNG`, `JPG`, `WEBP`, `PDF`, `TIFF` *(High-DPI Rasterizer)* |
| **💻 Developer Data** | `JSON`, `XML`, `YAML`, `CSV`, `TSV`, `MD`, `HTML` | `JSON`, `XML`, `YAML`, `CSV`, `HTML`, `PDF`, `DOCX`, `Minify`, `Pretty Format` |
| **📚 E-Book Tools** | `EPUB`, `MOBI`, `AZW3`, `FB2` | `EPUB`, `PDF`, `TXT`, `HTML`, `DOCX` *(Preserving TOC & Chapters)* |
| **🗂️ Archive Tools** | `ZIP`, `TAR`, `GZ`, `7Z`, `RAR` | `ZIP Creation`, `Extracted Files`, `Folder Organization` |
| **🔤 Font Tools** | `TTF`, `OTF`, `WOFF`, `WOFF2` | `TTF`, `WOFF`, `WOFF2`, `OTF` *(With Live Web Font Typeface Visualizer)* |
| **💬 Subtitles** | `SRT`, `VTT`, `ASS`, `SSA` | `VTT`, `SRT`, `TXT Transcript` *(Timestamp Synchronizer)* |
| **👁️ AI OCR Scanner** | `JPG`, `PNG`, `TIFF`, `PDF`, Scanned Docs | `TXT`, `DOCX`, `Searchable PDF` *(Multi-lingual Neural OCR Engine)* |

---

## 📁 Directory Structure

```text
universal/
├── src/
│   ├── assets/              # Static media assets & icons
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx             # Header with logo, queue counter, history link
│   │   ├── Sidebar.tsx            # Tool navigation menu for 13 category suites
│   │   ├── UniversalUploadZone.tsx# Multi-file drag & drop zone with sample files
│   │   ├── ModeSelector.tsx       # Mode switcher (Single, Multi, Batch, Merge)
│   │   ├── ConversionQueue.tsx    # Queue item list with progress & status
│   │   ├── BatchControls.tsx      # Bulk action buttons (Convert All, Download ZIP)
│   │   ├── AdvancedSettingsModal.tsx# Format options (Quality, PDF page size, Delimiters)
│   │   ├── FilePreviewModal.tsx   # Image zoom & code syntax preview modal
│   │   ├── BatchSummaryModal.tsx  # Completion stats modal with confetti
│   │   ├── HistoryView.tsx        # LocalStorage conversion history log
│   │   └── QuickToolsGrid.tsx     # Popular tools shortcut grid
│   ├── pages/               # Purpose-built tool pages with unique color themes
│   │   ├── ImageToolPage.tsx      # Electric Indigo/Purple Image Suite
│   │   ├── PdfToolPage.tsx        # Azure Blue/Sapphire PDF Studio
│   │   ├── DocumentToolPage.tsx   # Royal Blue Word Document Suite
│   │   ├── SpreadsheetToolPage.tsx# Emerald Green Excel & CSV Suite
│   │   ├── PresentationToolPage.tsx# Sunset Amber PowerPoint Suite
│   │   ├── VectorToolPage.tsx     # Neon Pink Vector Graphics Suite
│   │   ├── TextDataToolPage.tsx   # Cyber Cyan Developer Data Suite
│   │   ├── EbookToolPage.tsx      # Deep Amethyst E-Book Suite
│   │   ├── ArchiveToolPage.tsx    # Deep Purple ZIP & Archive Suite
│   │   ├── FontToolPage.tsx       # Hot Pink Web Font Studio
│   │   ├── SubtitleToolPage.tsx   # Electric Teal Subtitle Suite
│   │   └── OcrToolPage.tsx        # Ultra Violet AI OCR Document Scanner
│   ├── services/            # Conversion business logic & worker queue
│   │   ├── formatDetector.ts      # Magic byte signature parser
│   │   ├── formatMatrix.ts        # Dynamic programmatic format matrix
│   │   ├── workerQueue.ts         # Concurrency manager & converter router
│   │   ├── historyStorage.ts      # LocalStorage history manager
│   │   └── converters/            # Category processing engines
│   │       ├── imageConverter.ts
│   │       ├── pdfConverter.ts
│   │       ├── spreadsheetConverter.ts
│   │       ├── textDataConverter.ts
│   │       ├── subtitleConverter.ts
│   │       ├── archiveConverter.ts
│   │       ├── fontConverter.ts
│   │       └── ocrEngine.ts
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Main application router & state manager
│   ├── index.css            # Custom CSS design system & scrollbars
│   └── main.tsx             # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have **Node.js (v18.0 or higher)** and **npm** installed on your system.

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Monishwarann/imageConverter.git
   cd imageConverter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser to test **ConvertX**.

### Production Build

Compile the application for production:

```bash
npm run build
```

The optimized static build will be generated in the `dist/` directory.

---

## 🔒 Security & Privacy Guarantees

- **Zero Third-Party Uploads**: Files are converted entirely inside client browser memory.
- **Zip Bomb Protection**: Extraction limits uncompressed size to 500MB to prevent memory exhaustion.
- **Path Traversal Shield**: Blocks malicious `../` entry extraction paths in archives.
- **XSS & Script Sanitization**: `DOMPurify` sanitizes all rendered Markdown and HTML previews.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with by **[Monishwarann](https://github.com/Monishwarann)**.
