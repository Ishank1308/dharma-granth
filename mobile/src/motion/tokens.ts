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
  /** A bottom sheet rising into place: quick, with no bounce at the top. */
  sheet: { damping: 24, stiffness: 260, mass: 0.9 },
  /** Something flying from where you tapped to its place on the next screen (a cover onto its title page). */
  fly: { damping: 20, stiffness: 150, mass: 0.9 },
} satisfies Record<string, WithSpringConfig>;

export const DURATION = {
  /**
   * Content arriving (a book's title page opening, a toast). NN/g puts most UI motion at 100–500 ms and warns
   * that motion seen often should be shorter, so arrivals stay under 300 ms.
   */
  enter: 280,
  /** Simple feedback and anything leaving (a toast going): exits are quicker than entrances. */
  quick: 180,
} as const;

/** List rows rising in when a screen first opens: the gap between one row and the next, and how many rise. */
export const STAGGER = { step: 40, max: 8, rise: 14 } as const;

/** How far a pressed card sinks. */
export const PRESS_SCALE = 0.97;

/** The book cover's furthest tilt either way, in degrees. */
export const MAX_TILT = 14;
