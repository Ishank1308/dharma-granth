/** A source file that identifies itself as unreviewed must not be published. */
export function assertWrittenMeaningsReady(
  id: string,
  document: { note?: unknown; reviewStatus?: unknown },
): void {
  const status = typeof document.reviewStatus === "string" ? document.reviewStatus.toLowerCase().trim() : "";
  const note = typeof document.note === "string" ? document.note : "";
  const explicitlyUnreviewed = ["draft", "unreviewed", "needs-review", "pending-review"].includes(status) ||
    /\bunreviewed[\s_-]+draft\b/i.test(note);
  if (explicitlyUnreviewed) {
    throw new Error(
      `${id}: meaning file is explicitly unreviewed; verify the source, alignment and editorial approval before applying it.`,
    );
  }
}
