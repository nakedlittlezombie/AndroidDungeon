export type NavigationTab = 'library' | 'import' | 'downloads' | 'settings' | 'auth';

export type LibraryViewFilter = 'all' | 'series' | 'reading' | 'missing' | 'completed' | 'publishers';
export type PublisherFilter = 'all' | 'vertigo' | 'image' | 'darkhorse' | 'fantagraphics' | 'kodansha' | 'marvel' | 'indie';
export type SortOption = 'recent' | 'release' | 'alpha' | 'rating' | 'completion';
export type ViewMode = 'grid' | 'table' | 'timeline';

export interface IssueItem {
  id: string;
  seriesId: string;
  title: string;
  subtitle: string;
  publisher: string;
  issueNum: string;
  year: number;
  writers: string[];
  coverArtists: string[];
  pencillers: string[];
  colorists: string[];
  publishedDate: string;
  pageCount: number;
  format: string;
  fileSize: string;
  rating: number;
  readProgress: number; // 0 to 100
  readStatus: 'completed' | 'reading' | 'unread';
  coverUrl: string;
  logline: string;
  checksum: string;
}

export interface SeriesRunItem {
  id: string;
  title: string;
  years: string;
  publisher: string;
  imprintCategory: string;
  creators: string;
  volumesCount: number;
  totalIssues: number;
  ownedIssues: number;
  missingIssues: string[];
  completionPercentage: number;
  coverUrl: string;
  backdropUrl?: string;
  logline: string;
  fileSizeTotal: string;
  status: 'ongoing' | 'complete' | 'missing_issues';
  featuredDossierIssue?: string;
}

export interface StagedScrapeItem {
  id: string;
  filename: string;
  fileSize: string;
  fileFormat: string;
  catalogMatchTitle: string;
  publisher: string;
  year: number;
  confidenceScore: number;
  confidenceLabel: string;
  sourceKey: string;
  creators: string;
  genreAge: string;
  status: 'ready' | 'resolve' | 'busy';
  coverUrl: string;
  hasConflict?: boolean;
  conflictDetails?: {
    extractedTitle: string;
    extractedSeries: string;
    extractedRelease: string;
    rawXml: string;
    rawPageThumb: string;
    candidateId: string;
    canonicalTitle: string;
    publisherDate: string;
    upcBarcode: string;
    synopsis: string;
    variants: { id: string; name: string; coverUrl: string }[];
  };
}

export interface ActiveTransfer {
  id: string;
  title: string;
  creatorsPublisher: string;
  source: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  currentBytes: string;
  totalBytes: string;
  percentage: number;
  speed: string;
  eta: string;
  chunkProgress: string;
  securityNote: string;
  coverUrl: string;
  formatBadge: string;
  paused: boolean;
}

export interface CompletedIngest {
  id: string;
  title: string;
  creatorsPublisher: string;
  status: 'SHA256 VALID' | 'CHECKSUM QUEUED' | 'CORRUPTED';
  payload: string;
  sourceNode: string;
  ingestedAt: string;
}

export interface HarvesterResult {
  id: string;
  title: string;
  subtitle: string;
  sourceName: string;
  sourceType: 'ddl' | 'torrent' | 'usenet' | 'opds';
  payload: string;
  availability: string;
}

export interface ReaderState {
  isOpen: boolean;
  comicTitle: string;
  issueLabel: string;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  fitMode: 'width' | 'height' | 'spread';
  flowDirection: 'ltr' | 'rtl';
}

export interface SystemSettings {
  cvDbPath: string;
  cvSyncWeekly: boolean;
  gcdDbPath: string;
  torrentClient: string;
  torrentHost: string;
  torrentPort: string;
  torrentUser: string;
  nzbClient: string;
  nzbHost: string;
  nzbPort: string;
  prowlarrUrl: string;
  ddlPath: string;
  ddlMirrorPref: string;
  standardizedNaming: boolean;
  namingPattern: string;
  webpThumbnailEngine: boolean;
  preserveOriginalCbr: boolean;
  autoStripAds: boolean;
  defaultCanvasFit: 'width' | 'spread' | 'height';
  readingFlowDirection: 'ltr' | 'rtl';
  lookaheadFrameCache: number;
}
