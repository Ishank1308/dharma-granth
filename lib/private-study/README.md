# Private study foundation

This module owns new device-local study records. It does not contact a server or
read the site's canonical scripture content. Consumers must resolve a verse
against the published content before presenting it as a valid citation. The
reference validator only guarantees a safe, stable identifier shape.

`putStudyRecord`, `deleteStudyRecord`, and `listStudyRecords` are asynchronous
IndexedDB operations. Await them and show failures to the reader; browser
storage may be unavailable or full. Record IDs are caller-owned. Use a stable
ID for singletons such as bookmarks and a random ID for multiple notes.

`importStudyArchive` validates all records before writing, then merges by ID in
one transaction. `exportStudyArchive` returns a plain object for JSON download.
Existing localStorage keys are deliberately untouched. Before migrating them,
map every legacy key and confirm its verse identity and backup behavior.

Integration checklist:

- Keep browser-only calls inside client effects or handlers.
- Resolve references through published scripture data before linking or citing.
- Decide whether legacy UI reads both stores during migration; avoid duplicate marks.
- Extend the existing backup and clear-data controls before exposing this store in UI.
- Keep notes and highlights private unless the reader explicitly exports them.
