/**
 * The app's motion vocabulary, in one place, so every screen moves with the same physics.
 *
 * Springs rather than timed curves: a spring picks up from wherever a gesture leaves it, so a press that is
 * interrupted, or a cover let go mid-tilt, settles naturally instead of jumping. The values are tuned to feel
 * like Apple's and One UI's system springs: quick to respond, settling without a wobble you would notice.
 */
import type { WithSpringConfig } from 'react-native-reanimated';

export const SPRING = {
  /** A finger pressing a card or button down: fast and firm. */
  press: { damping: 18, stiffness: 420, mass: 0.6 },
  /** Letting go, and most things settling into place. */
  settle: { damping: 16, stiffness: 220, mass: 0.8 },
  /** Large, slow things: a book cover returning to rest, a header easing in. */
  gentle: { damping: 20, stiffness: 120, mass: 1 },
  /** A small, lively overshoot for a selection: the tab bar pill, a bookmark filling in. */
  lively: { damping: 13, stiffness: 260, mass: 0.7 },
} satisfies Record<string, WithSpringConfig>;

export const DURATION = {
  /**
   * A content fade, as a screen's rows arrive. NN/g puts most UI motion at 100–500 ms and warns that
   * animation seen often should be shorter: these screens open many times a day, so it stays under 300.
   */
  enter: 280,
  /** One step of a staggered list: ten rows land within a third of a second. */
  stagger: 32,
  /** Simple feedback (a toggle, a toast leaving): about 100–200 ms. */
  quick: 180,
  /** The slow breath of ambient artwork (drift, foil shimmer). */
  ambient: 9000,
} as const;

/** Only the first rows of a list arrive with a stagger; the rest are already there when you scroll to them. */
export const STAGGER_LIMIT = 10;

/** How far a pressed card sinks. */
export const PRESS_SCALE = 0.97;

/** The book cover's furthest tilt either way, in degrees. */
export const MAX_TILT = 14;
