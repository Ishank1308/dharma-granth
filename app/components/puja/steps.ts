/**
 * Ritual and festival steps are written "शीर्षक — विवरण": a short title, an em dash with
 * spaces, then one or two sentences. Shared by the server-rendered step lists and Puja mode.
 */
export function splitStep(step: string): { title: string; detail: string } {
  const at = step.indexOf(' — ');
  if (at === -1) return { title: step.trim(), detail: '' };
  return { title: step.slice(0, at).trim(), detail: step.slice(at + 3).trim() };
}
