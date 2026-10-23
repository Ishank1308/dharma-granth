export type AnalyticalPerspective =
  | 'psychological'
  | 'cognitive'
  | 'ethical'
  | 'linguistic'
  | 'philosophical'
  | 'historical'
  | 'ecological'
  | 'social'
  | 'contemplative'
  | 'observational'
  | 'not-applicable';

export type EditorialLayer =
  | 'padaccheda'
  | 'anvaya'
  | 'word-meaning'
  | 'artha'
  | 'vyakhya'
  | 'traditional-commentary'
  | 'vigyana'
  | 'modern-application'
  | 'misreading-guard';

export type EpistemicLabel =
  | 'direct-meaning'
  | 'contextual-explanation'
  | 'traditional-commentary'
  | 'analytical-perspective'
  | 'editorial-application'
  | 'misreading-guard';

export type ReviewStatus =
  | 'draft'
  | 'editorial-review'
  | 'source-review'
  | 'needs-human-review'
  | 'approved'
  | 'published'
  | 'rejected';

export type SourceKind =
  | 'primary-text'
  | 'traditional-commentary'
  | 'translation'
  | 'scholarship'
  | 'scientific'
  | 'editorial';

export interface CanonicalReference {
  scriptureId: string;
  chapterId: string;
  verseId: string;
}

export interface SourceReference {
  id: string;
  kind: SourceKind;
  title: string;
  author?: string;
  edition?: string;
  locator?: string;
  url?: string;
  accessedOn?: string;
}

export interface EditorialProvenance {
  sources: SourceReference[];
  method: 'quoted' | 'translated' | 'summarized' | 'paraphrased' | 'editor-authored' | 'analytical-synthesis';
  confidence: 'high' | 'medium' | 'low';
  reviewer?: string;
  reviewedOn?: string;
  notes?: string;
}

export interface EditorialEnrichment {
  id: string;
  canonicalRef: CanonicalReference;
  layer: EditorialLayer;
  text: string;
  language: 'hi' | 'en' | 'sa' | 'mixed';
  epistemicLabel: EpistemicLabel;
  provenance: EditorialProvenance;
  status: ReviewStatus;
  analyticalPerspective?: AnalyticalPerspective;
  /** Required and true for modern examples; this is never scripture text. */
  notScripture?: true;
}

export type ReviewReason =
  | 'canonical-uncertainty'
  | 'source-missing'
  | 'source-conflict'
  | 'translation-ambiguity'
  | 'traditional-attribution'
  | 'scientific-claim'
  | 'possible-boilerplate'
  | 'possible-translation-copy'
  | 'missing-layer'
  | 'numbering-mismatch'
  | 'privacy-or-provenance';

export interface ReviewQueueItem {
  id: string;
  canonicalRef: CanonicalReference;
  layer: EditorialLayer;
  reason: ReviewReason;
  priority: 'low' | 'medium' | 'high' | 'blocking';
  evidence: string;
  status: 'open' | 'in-review' | 'resolved' | 'wont-fix';
  createdOn: string;
  resolvedOn?: string;
  resolution?: string;
}
