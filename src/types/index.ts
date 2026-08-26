export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string | null;
  pageCount: number;
  chapters: Chapter[];
  pages: BookPage[];
  metadata: BookMetadata;
  createdAt: string;
  updatedAt: string;
  status: 'converting' | 'ready' | 'error';
  conversionMode: 'reflow' | 'preservation';
  originalPdfName: string;
  originalPdfSize: number;
  isFavorite: boolean;
  tags: string[];
}

export interface Chapter {
  id: string;
  title: string;
  pageNumber: number;
  level: number;
}

export interface BookPage {
  id: string;
  pageNumber: number;
  content: PageContent[];
  html: string;
  hasImages: boolean;
}

export interface PageContent {
  type: 'text' | 'heading' | 'image' | 'list' | 'quote' | 'note';
  level?: number;
  text?: string;
  src?: string;
  alt?: string;
  items?: string[];
}

export interface BookMetadata {
  originalPages: number;
  extractedImages: number;
  hasOcr: boolean;
  detectedChapters: number;
  conversionMode: 'reflow' | 'preservation';
  fileSize: number;
  processingTime: number;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastReadAt: string;
  chapterId?: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  pageNumber: number;
  title: string;
  createdAt: string;
  color?: string;
}

export interface Highlight {
  id: string;
  bookId: string;
  pageNumber: number;
  text: string;
  color: string;
  createdAt: string;
  note?: string;
}

export interface BookNote {
  id: string;
  bookId: string;
  pageNumber: number;
  text: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversionJob {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'black' | 'custom';

export interface ThemeConfig {
  name: ReaderTheme;
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  border: string;
}

export type PageMode = 'single' | 'double' | 'scroll';
export type PageAnimation = 'flip' | 'slide' | 'fade' | 'none';

export interface ReaderSettings {
  theme: ReaderTheme;
  customTheme?: { background: string; foreground: string; accent: string };
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
  contentWidth: number;
  pageMode: PageMode;
  pageAnimation: PageAnimation;
  clickToTurn: boolean;
  swipeToTurn: boolean;
  autoSaveProgress: boolean;
  reduceAnimations: boolean;
}

export interface TypographyPreset {
  name: string;
  label: string;
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface SearchResult {
  pageNumber: number;
  text: string;
  context: string;
  index: number;
}

export interface LibraryFilter {
  search: string;
  sort: 'recent' | 'title' | 'author' | 'pages' | 'progress';
  order: 'asc' | 'desc';
  status: 'all' | 'reading' | 'completed' | 'unread' | 'favorite';
}
