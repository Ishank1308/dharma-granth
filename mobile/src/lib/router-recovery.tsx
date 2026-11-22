import { useRouter } from 'expo-router';
import { unboundRouter } from 'expo-router/build/global-state/router';
import { useEffect } from 'react';

/**
 * Keeps `router.push()` (the imperative router most screens import) working after Android recreates the
 * activity, for example when the reader changes the system font size, display size or language.
 *
 * Expo Router binds that global router when the navigation tree mounts and resets it to `unboundRouter`
 * (whose methods throw "The imperative router is unavailable before the first render has finished") when
 * a tree unmounts. On a recreation the new tree mounts before the old one finishes unmounting, so the old
 * tree's cleanup unbinds the router the new tree just bound, and the next tap on a book cover crashed the
 * app (found in QA of v4). Here the unbound methods forward to the live, context-bound router instead of
 * throwing, so a late cleanup can no longer break navigation. Before any tree has mounted they still throw.
 */
type Methods = Record<string, (...args: unknown[]) => unknown>;

let live: Methods | null = null;
let patched = false;

function patchUnbound() {
  if (patched) return;
  patched = true;
  const target = unboundRouter as unknown as Methods;
  for (const key of Object.keys(target)) {
    if (key === 'setTransitionMode') continue; // already harmless before the first render
    const original = target[key];
    target[key] = (...args: unknown[]) => (live && typeof live[key] === 'function' ? live[key](...args) : original(...args));
  }
}

/** Render once inside the root layout. */
export function RouterRecovery() {
  const router = useRouter() as unknown as Methods;
  useEffect(() => {
    patchUnbound();
    live = router;
    return () => {
      if (live === router) live = null;
    };
  }, [router]);
  return null;
}
