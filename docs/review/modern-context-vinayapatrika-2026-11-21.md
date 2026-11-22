# Modern-context notes: Vinaya Patrika (review note, 21 November 2026)

This note goes with the pull requests that add modern-context notes (`lifeLesson`) to the Vinaya Patrika of Goswami Tulsidas. It records how the notes were checked, the caveat each note carries, the sensitive lines and the facts a reviewer should check first. The notes are AI drafts and have not had a human editorial review.

## Status

- **Coverage:** all 1,483 Vinaya Patrika entries now have a modern-context note. Two had one before this work (1:1 and 45:1) and were not changed; the other 1,481 were written on 21 November 2026.
- **Pull requests:** 304 (1:2 to 53:1) went in with #427, 456 (53:2 to 136:3) with #439, and the last 721 (136:4 to 279:3) with this note.
- **Source file:** `data/hi-commentary/vinayapatrika-rest.json` holds only the `lifeLesson` field; the व्याख्या stays in its own source. The published `explanation` is unchanged for every entry; this was verified after each publish against master.
- **Size:** after this book the published commentary is 70,420 KB, under the cap of 71,680 KB (`MAX_TOTAL_MB = 70`, set in #413). The cap now has little room left, so the next book will need either a stated raise or the per-section storage in #393.

## How the notes were made and checked

- **Writers:** four runs of 6 to 9 writers wrote separate ranges in parallel (Ishank's choice on 21 November, to finish faster). Each writer screened its planned facts against every earlier note in every book and recorded them in a shared claims list, so writers working at the same time on Samaveda and Vinaya Patrika could not take the same fact. Every batch was checked centrally before publishing, by one publisher.
- **Register:** every batch passed `scripts/check-hindi-register.mjs` with 0 sentences to fix; no nukta letters; no first person and no तुम-forms. Tulsidas speaks in the first person in the source; every note reports him in the third person ("तुलसीदास कहते हैं कि वे …"). Notes run 160 to 185 words (160 to 180 in the last two runs, to stay under the size cap).
- **Grammar:** each note reads "… यह पंक्ति …" once; no link starts with का, की or के.
- **Facts used once:** the stricter cross-book check was run on each batch and over the whole book. One real repeat was found and fixed before publishing (46:4 had the same harsingar fact as Samaveda 2:608; it now uses the night-blooming Epiphyllum commonly called ब्रह्मकमल). Other flagged pairs were judged to be different facts, for example 57:1 (Srirangam Rajagopuram) and Brahma Sutra 2.2.42 (Pancharatra worship at Srirangam); 116:2 (a 2004 Gombe study) and Brahma Sutra 3.4.37 (Jane Goodall, 1960); 143:3 (kural 452) and 20:3 (the kural chapter on sweet speech); 169:2 (Tantalus in the Odyssey) and Shiva Swarodaya 1:67 (the Sirens); 174:1 (Chaitanya's sannyasa at Katwa) and Shiva Samhita 3:41 (Chaitanya's Navadvip kirtan); 235:3 (Leonardo's Battle of Anghiari) and Samaveda 4:1846 (his notebook on bird flight); 275:2 (Kuldhara) and Samaveda 4:1222 (the Paliwal khadin).

## Standing caveats and the notes that carry them

The Vinaya Patrika is 279 devotional padas in Braj and Avadhi, addressed to Ganesha, Surya, Shiva, Devi, Ganga, Hanuman, Rama and others; many are the poet's confessions of his own faults and pleas for grace. Each note that needs it carries one of these standing sentences. 779 notes needed none.

- **DI: Self-reproach: calling oneself a sinner is the humility style of bhakti poetry; a reader in deep guilt or despair should talk to someone they trust or to a doctor.** (198 notes) 10:9; 11:8; 28:6; 33:3, 33:4; 34:3; 35:5; 41:2; 56:9; 59:7; 59:9; 60:7; 60:9; 62:13; 68:5; 69:5; 71:1; 71:7 to 72:3; 76:2; 78:1; 79:1, 79:2; 82:3; 83:1 to 83:5; 88:4; 90:4; 91:5, 92:1; 92:7; 94:1; 94:6, 95:1; 96:1, 96:2; 97:5; 99:4; 106:6; 109:2, 109:3; 110:3, 110:4; 113:3; 114:1; 114:3; 114:5; 117:1; 117:3 to 118:1; 118:5; 122:1; 127:1; 127:4; 130:5; 134:7; 141:1 to 141:5; 142:1; 142:3 to 142:5; 142:7 to 142:9; 143:4; 143:7; 144:5; 145:7; 147:1; 147:5; 148:1; 148:4; 149:3; 150:3; 153:1; 158:1 to 158:4; 158:6 to 159:3; 160:1; 161:3; 163:4; 164:7; 166:10; 168:1; 168:3; 168:5; 170:1; 170:3 to 171:1; 171:3 to 171:6; 176:1; 176:5; 177:4; 179:4; 181:2; 182:2; 185:1 to 185:5; 186:1 to 186:3; 187:1; 191:9; 194:2; 195:4; 197:3; 200:1; 201:1; 201:5, 202:1; 202:4, 202:5; 207:3 to 208:3; 209:2; 209:5; 210:4; 211:2; 211:4; 214:6; 217:6; 222:2; 222:5; 224:1; 226:3; 230:3; 232:3; 233:1, 233:2; 234:1; 234:3 to 235:3; 236:4; 238:2; 241:4; 242:1, 242:2; 244:3; 244:5, 245:1; 245:3, 245:4; 252:1 to 252:4; 256:2; 258:1 to 258:4; 259:4, 260:1; 261:2 to 261:4; 266:4; 267:4; 271:2; 271:4; 272:2 to 272:4; 274:3; 275:3; 276:4; 278:3

- **NM: The power of the Name and of grace: the faith and style of the bhakti tradition, not a promised result.** (150 notes) 6:3; 9:2; 13:6; 13:8; 19:1; 20:2; 22:7; 24:4 to 24:6; 28:4; 30:1 to 31:1; 31:5, 31:6; 32:5; 35:6, 36:1; 40:4; 41:3, 41:4; 44:1; 44:6; 46:1; 46:6 to 46:9; 49:9; 50:9; 51:3; 51:9; 54:8; 55:1; 55:3; 55:6; 65:1 to 65:4; 67:4; 70:5; 77:1; 78:4; 80:4; 83:6; 84:4; 85:3; 87:4; 89:4; 96:3; 97:4; 99:1; 99:4; 105:2; 116:1; 116:5; 119:5; 123:1; 127:5; 128:4 to 129:2; 130:1; 130:3; 131:1; 135:5; 137:1; 140:3; 141:6; 142:10, 142:11; 143:5; 144:1; 146:4; 149:6; 151:7; 151:9; 152:11; 155:1; 155:4; 156:1; 159:4; 168:5; 169:3; 170:7; 173:6; 178:5; 180:2; 182:6; 184:1; 184:4, 184:5; 185:6; 186:6; 187:4, 187:5; 189:1; 191:8; 192:4; 193:3; 193:7; 197:3; 202:3; 205:4; 207:2; 208:4; 209:4; 212:2; 220:1, 220:2; 225:4, 226:1; 226:5 to 227:1; 227:3 to 228:2; 228:5; 233:3; 236:3; 241:1, 241:2; 244:4; 247:1, 247:2; 247:4; 252:5; 254:1 to 255:4; 257:3; 261:1; 262:5; 267:3; 269:3, 270:1; 272:5; 273:2, 273:3; 275:4; 279:3

- **KY: The picture of the Kali age: the poet's lament about his own time, not censure of any group.** (46 notes) 12:4; 19:3; 21:1; 24:1; 32:2; 48:4; 52:9; 55:7; 66:2; 67:1; 94:4; 97:3; 109:2; 128:2; 129:2; 139:1 to 139:7; 146:1; 155:3; 173:1; 181:3; 183:3 to 184:3; 192:1, 192:2; 195:2; 219:2; 220:3, 220:4; 221:2, 221:3; 225:2; 229:3; 237:3; 250:4; 259:2; 262:5; 265:2; 266:3

- **JT: Caste and lineage words: the language of that society; the poet's point is that devotion knows no high or low.** (38 notes) 1:4; 3:3; 5:3; 12:3; 44:8; 46:9; 57:2, 57:3; 69:3; 76:4; 99:3; 106:5; 130:3; 135:1; 135:4; 139:4; 144:4; 152:7; 154:2; 166:3; 166:6; 180:6; 180:8; 183:2; 192:2; 193:4; 207:2; 212:2; 215:1, 215:2; 215:4; 230:2; 240:1; 240:3; 248:4; 257:2; 264:5; 271:3

- **WM: Lines about women: the language of a renunciate of that time, a warning against attachment, not censure of women.** (11 notes) 14:3; 14:8; 81:4; 82:2; 89:2; 136:7; 140:2; 142:2; 170:2; 200:2; 201:3

- **SN: Heaven, hell and rebirth: faith and symbolic language.** (52 notes) 9:5; 18:3; 21:2; 22:8; 57:5; 57:8; 60:7; 63:9; 68:3; 82:1; 88:3; 94:6 to 95:3; 97:4; 102:3; 109:4; 110:2; 112:4; 124:3; 132:2; 136:3; 136:9; 140:1; 151:6; 151:8; 152:11; 155:5; 160:3; 171:1; 173:2; 188:3; 193:3; 199:2, 199:3; 201:3; 202:3; 203:12; 203:18; 209:3; 209:5; 210:3; 211:2; 229:2; 231:2, 231:3; 241:2; 243:2; 261:4; 267:2; 276:1

- **PK: Purana stories: faith and poetry, not proven history.** (179 notes) 2:2; 2:4; 3:2 to 3:4; 4:2, 4:3; 5:4; 6:1, 6:2; 6:4 to 7:1; 7:3; 7:5 to 8:4; 9:3; 10:5; 11:7; 13:7; 15:4; 18:2; 20:1; 22:1; 22:4; 22:9; 24:3; 25:1, 25:2; 26:4 to 26:7; 28:3; 29:3, 29:4; 31:3, 31:4; 36:5; 37:2; 38:1; 38:3; 39:3, 39:4; 40:3; 42:3; 43:3; 43:6; 43:8; 49:6, 49:7; 50:4; 52:2 to 52:7; 53:2; 53:4, 53:5; 54:1; 54:3, 54:4; 54:9; 55:8; 56:3, 56:4; 56:8; 59:1; 60:4; 62:6; 63:3, 63:4; 67:4; 70:2; 78:5; 83:6; 86:1; 86:3; 86:5; 87:2, 87:3; 93:2 to 93:4; 96:3, 97:1; 97:4; 98:2 to 98:5; 100:4; 106:2; 107:2; 108:1; 112:2; 128:3; 134:2, 134:3; 134:5; 136:4; 136:8; 137:2, 137:3; 138:3, 138:4; 139:9; 144:2, 144:3; 145:2; 145:6; 146:5; 151:7; 152:2 to 152:4; 160:2; 165:4; 166:2; 166:4; 166:7; 166:9; 174:2; 179:3; 180:4; 181:4; 187:4; 191:6; 193:4 to 193:6; 198:2; 200:3; 202:5; 206:3, 206:4; 211:1; 212:3; 213:2 to 213:4; 214:2 to 214:5; 215:3; 215:5, 215:6; 216:2, 216:3; 217:2 to 217:4; 218:3; 220:5; 220:7; 225:3; 226:4; 228:3, 228:4; 236:3; 239:2 to 239:6; 240:2; 241:3; 247:2, 247:3; 248:3; 249:2; 257:2; 260:2

- **DH: Renunciation language: about lessening attachment, not neglect of the body or of treatment.** (17 notes) 58:3; 73:1; 104:4; 115:3; 127:2; 136:1; 142:6; 172:4; 176:2; 188:1, 188:2; 189:2, 189:3; 190:2; 204:1; 251:3; 277:2

- **RK: A modern comparison is only a metaphor.** (73 notes) 16:1; 19:1; 21:1; 26:2, 26:3; 28:1, 28:2; 31:1; 31:6; 38:4; 44:3; 46:3; 53:9; 57:9; 67:3; 68:4; 70:1; 70:3, 70:4; 72:4; 73:2 to 73:4; 74:2; 75:1; 81:5; 83:4; 92:1; 94:4; 96:3; 102:3; 103:3, 103:4; 105:3; 107:5; 108:4; 110:1; 112:5; 114:2; 119:3; 120:3; 124:1; 124:3; 128:3 to 129:1; 145:4; 146:4; 147:2; 149:5; 152:12; 153:3; 157:2; 160:3; 161:2; 162:4; 167:4, 167:5; 177:3; 193:8; 197:3; 203:14, 203:15; 209:2; 212:1; 226:4; 246:3; 255:3; 261:1; 265:2; 269:1; 276:4; 279:3

## Sensitive lines (read first)

- **Self-reproach:** every line where the poet calls himself a sinner carries DI, which tells a reader in deep guilt or despair to talk to someone they trust or to a doctor.
- **Harassment:** 8:3 adds a bullet saying that putting up with harassment is not the teaching, and that the reader should seek help.
- **137:2:** mentions that the Prahladpuri temple in the Multan fort was destroyed in 1992, in the passive voice and without naming anyone.
- **Kali age, caste and women:** see the KY, JT and WM lists above; no note names a group of people as blameworthy.
- **Private people named from news reports:** 215:1 (Nowshad, Kochi, 2019 floods), 215:4 (Anupriya of Villupuram, 2018) and 216:1 (Chennai floods, 2015). These are kind acts that were widely reported, but the writers were not sure of every detail; please verify or remove the names.

## Facts the writers were least sure of

- **18:3:** LaBouff and others 2012: whether agreeableness was controlled.
- **27:3:** Hanumanmata's six ragas and five raginis each.
- **38:5:** Dufferin Bridge 1887: deck order and the 1948 renaming as Malviya Setu.
- **47:1:** Roridomyces phyllostachydis, found in Meghalaya 2018, named 2020.
- **60:5, 62:2, 63:7:** The Seraphim hagiography, the Jami prologue and the reading of the tress in Shabistari; verse numbers in 61:3, 61:6, 62:4, 63:2 and 63:5 may be off by one.
- **103:3:** Turtle sanctuary on the Ganga at Varanasi, 1989.
- **126:3:** The mock funeral procession for Agarkar (no year given).
- **162:2:** Charity Birds Hospital, Chandni Chowk, 1929.
- **183:2:** Kalanamak rice GI tag, 2013.
- **198:3:** Otsuchi wind phone, Itaru Sasaki, 2010.
- **215:1, 215:4, 216:1:** News-report details (see above).
- **228:3:** Names and date of the Italian restorers who varnished the Ajanta murals.
- **235:1:** Early attributions of Vermeer's Girl Reading a Letter.
- **236:2:** Figures for the Datini archive.
- **259:4:** Mollenhorst: about half of close contacts changed in 7 years.

The full list of facts to spot-check, line by line, is in `docs/review/modern-context-vinayapatrika-spot-checks-2026-11-21.md` (taken from the writers' reports; it covers 1227 of the 1,481 notes, and for the rest the fact is in the note itself).

