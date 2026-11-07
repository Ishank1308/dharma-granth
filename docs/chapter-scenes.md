# Chapter scenes

Each chapter (adhyāya, kāṇḍa, khaṇḍa, valli…) can carry a faint moving picture of its setting behind
the Sanskrit panel of every verse card, on the chapter page and on each verse page.

- Mapping: `lib/chapter-scenes.ts` (scripture id → chapter number → scene id, with English and Hindi captions).
- Drawing: `app/styles/scenes.css` stacks one-colour SVG masks from `app/styles/scenes/` over a gradient in the
  card's own colours, so one drawing works in Day, Sunset, Paper and Night.
- Layers: `node scripts/build-chapter-scenes.mjs` redraws the SVGs. Next bundles them as hashed files under
  `/_next/static/media/`, so they are cached as immutable and only the layers a page uses are downloaded.
- Motion: the masks drift by whole tiles, so loops never jump. No JavaScript, nothing added to each verse's HTML.
  Motion stops under `prefers-reduced-motion` and the quiet modes (`data-low-power`, `data-data-saver`,
  `data-lite-mode`, `data-reading-lite`). The still picture stays. Hidden in print and forced colours.
- Contrast: the scene's opacity is set per theme (`--scene-alpha`). Text over the scene band measured at least
  8.6:1 in all four themes on the Gita prototype.

## Bhagavad Gita (live)

| Ch | Scene | Grounding |
|---|---|---|
| 1 | Two armies at Kurukshetra, banners passing, dust, birds | 1.1–1.20 |
| 2 | The chariot halted between the armies | 1.24, 2.10 |
| 3 | Yajña fire, sparks rising | 3.9–3.16 |
| 4 | The sun on the horizon | 4.1 (Vivasvān) |
| 5 | Lotus leaves drifting on water | 5.10 |
| 6 | Yogī in the mountains, a still lamp | 6.11–6.19 |
| 7 | Pearls on one thread, stars | 7.7 |
| 8 | Sun and moon over the two paths | 8.24–8.26 |
| 9 | Leaf, flower, fruit and water; petals falling | 9.26 |
| 10 | Himalaya and the Ganga | 10.25, 10.31 |
| 11 | A radiance of a thousand suns | 11.12 |
| 12 | Lamps floating on the river, petals | 12.13–12.20 |
| 13 | A ripe field | 13.1–13.2 |
| 14 | Three strands braided | 14.5 |
| 15 | The inverted aśvattha, leaves drifting | 15.1 |
| 16 | Dawn through storm clouds | 16.1–16.6 |
| 17 | Yajña fire | 17.11–17.13 |
| 18 | The chariot at sunrise | 18.78 |

## Proposed next (needs new layers marked *)

- **Vālmīki Rāmāyaṇa:** Bāla, Sarayū and Ayodhyā's towers*; Ayodhyā, the road into exile*; Araṇya, forest
  hermitage with the golden deer*; Kiṣkindhā, Ṛṣyamūka hills (mountains); Sundara, the ocean leap to Laṅkā*;
  Yuddha, the bridge and battle (armies + ocean*); Uttara, the coronation (diyas, petals).
- **Kaṭha Upaniṣad:** Naciketā at Yama's door, the fire altar (yajna) and the chariot image of 1.3.3–4 (chariot).
- **Durgā Saptaśatī:** Madhu-Kaiṭabha on the cosmic ocean*, Mahiṣāsura's battle (armies), Śumbha-Niśumbha
  (mountains, radiance).
- **Vedas, Purāṇas and long texts:** one scene per kāṇḍa/skandha or per book, chosen from the shared library,
  rather than one per sūkta.
