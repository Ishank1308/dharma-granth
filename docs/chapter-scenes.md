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

## Vālmīki Rāmāyaṇa (live; chapter = kāṇḍa)

| Kāṇḍa | Scene |
|---|---|
| 1 Bāla | Ayodhyā's spires and palaces on the Sarayū |
| 2 Ayodhyā | Rāma, Sītā and Lakṣmaṇa walking into exile, forest behind |
| 3 Araṇya | The leaf hut at Pañcavaṭī and the golden deer, leaves drifting |
| 4 Kiṣkindhā | Forested hills over Lake Pampā |
| 5 Sundara | Hanumān in mid-leap over the sea, Laṅkā ahead |
| 6 Yuddha | The setu across the sea to Laṅkā, dust of the army |
| 7 Uttara | Ayodhyā at peace, petals falling |

Text over the scene band measured at least 7.3:1 in all four themes.

## Kaṭha Upaniṣad (live; chapter = vallī)

| Vallī | Scene | Grounding |
|---|---|---|
| 1.1 | Naciketā seated at Yama's door, stars turning | 1.1.9 |
| 1.2 | Two paths under sun and moon: śreyas and preyas | 1.2.1–2 |
| 1.3 | The chariot on the open road | 1.3.3–4 |
| 2.1 | The yogī and the smokeless flame | 2.1.12–13 |
| 2.2 | A radiance by which all shines | 2.2.15 |
| 2.3 | The inverted aśvattha | 2.3.1 |

## Durgā Saptaśatī (live; chapter = adhyāya)

| Adhyāya | Scene |
|---|---|
| 1 | Viṣṇu on Śeṣa in the single ocean, Brahmā's lotus |
| 2, 6, 8, 9 | The triśūla over the asura host |
| 3 | The triśūla blazing on the mountain, sparks rising |
| 4, 11 | The gods' hymn: radiance, petals falling |
| 5 | The Himālaya (5.7–8, yā devī sarvabhūteṣu) |
| 7 | Kālī from storm clouds |
| 10 | The duel in the sky |
| 12 | Offering (phala-stuti) |
| 13 | Lamps on the river (Suratha and Samādhi's worship) |

## Next candidates

- **Vedas, Purāṇas and long texts:** one scene per kāṇḍa/skandha or per book, chosen from the shared library,
  rather than one per sūkta.
