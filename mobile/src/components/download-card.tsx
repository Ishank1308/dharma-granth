import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { accentFill, Card, glass } from '@/components/ui';
import { getEntry, webUrl } from '@/content/catalog';
import { cancelDownload, deleteDownload, formatBytes, startDownload, useDownloads, useRemoteIndex } from '@/content/downloads';
import type { CatalogEntry } from '@/content/types';
import { useAppState } from '@/state/app-state';
import { RADIUS, SPACE, TYPE } from '@/theme/themes';

/** Download, progress, update and delete for one large text, shown at the top of its chapter list. */
export function DownloadCard({ entry }: { entry: CatalogEntry }) {
  useRemoteIndex();
  const { palette } = useAppState();
  const { installed, jobs, errors, index, indexStatus } = useDownloads();
  const id = entry.id;
  const mine = installed[id];
  const job = jobs[id];
  const error = errors[id];
  const remote = index?.books[id];
  const update = Boolean(mine && remote && remote.version !== mine.version);

  const title = { color: palette.text, fontSize: TYPE.callout, fontWeight: '600' } as const;
  const note = { color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 } as const;

  const confirmDelete = () =>
    Alert.alert(`Delete ${entry.title}?`, `This frees ${formatBytes(mine?.bytes ?? 0)}. You can download it again at any time.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDownload(id) },
    ]);

  if (job) {
    const pct = job.total > 0 ? Math.min(100, Math.round((job.received / job.total) * 100)) : 0;
    return (
      <Card style={{ rowGap: SPACE.sm }}>
        <View style={styles.row}>
          <Ionicons name="cloud-download-outline" size={22} color={palette.accent} />
          <View style={{ flex: 1 }}>
            <Text style={title}>Downloading… {pct}%</Text>
            <Text style={note}>
              {job.total > 0 ? `${formatBytes(job.received)} of ${formatBytes(job.total)}` : 'Starting…'} · डाउनलोड हो रहा है
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Cancel download" onPress={() => cancelDownload(id)} style={[styles.btn, glass(palette, true)]}>
            <Text style={[styles.btnText, { color: palette.text }]}>Cancel</Text>
          </Pressable>
        </View>
        <View
          style={[styles.track, { backgroundColor: palette.border }]}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: pct }}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
        </View>
      </Card>
    );
  }

  if (mine) {
    return (
      <Card style={styles.row}>
        <Ionicons name="checkmark-circle" size={22} color={palette.gold} />
        <View style={{ flex: 1 }}>
          <Text style={title}>Downloaded · {formatBytes(mine.bytes)}</Text>
          <Text style={note}>{update ? 'A corrected edition is available.' : 'Readable offline. ऑफ़लाइन पढ़ें।'}</Text>
          {error ? <Text style={[note, { color: palette.accent }]}>{error}</Text> : null}
        </View>
        {update ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Update download" onPress={() => startDownload(id)} style={[styles.btn, accentFill(palette)]}>
            <Text style={[styles.btnText, { color: palette.onAccent }]}>Update</Text>
          </Pressable>
        ) : null}
        <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${entry.title} from this phone`} onPress={confirmDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={palette.muted} />
        </Pressable>
      </Card>
    );
  }

  const size = remote ? `About ${formatBytes(remote.gz)} to download, ${formatBytes(remote.bytes)} on your phone.` : null;
  return (
    <Card style={{ rowGap: SPACE.md }}>
      <View style={styles.row}>
        <Ionicons name="cloud-download-outline" size={22} color={palette.accent} />
        <View style={{ flex: 1 }}>
          <Text style={title}>Download to read offline</Text>
          <Text style={note}>
            {size ??
              (indexStatus === 'error'
                ? 'Could not reach dharmagranth.dev. Check your connection.'
                : indexStatus === 'ready'
                  ? 'This text is not available for download yet.'
                  : 'Checking size…')}
          </Text>
          <Text style={note}>ऑफ़लाइन पढ़ने के लिए डाउनलोड करें।</Text>
          {error ? <Text style={[note, { color: palette.accent }]}>{error}</Text> : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', columnGap: SPACE.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Download ${entry.title}`}
          disabled={indexStatus === 'ready' && !remote}
          onPress={() => startDownload(id)}
          style={[styles.wide, accentFill(palette), indexStatus === 'ready' && !remote && { opacity: 0.5 }]}>
          <Text style={[styles.btnText, { color: palette.onAccent }]}>Download · डाउनलोड</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Read on dharmagranth.dev"
          onPress={() => Linking.openURL(webUrl(id)).catch(() => {})}
          style={[styles.wide, glass(palette, true)]}>
          <Text style={[styles.btnText, { color: palette.text }]}>Read online</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', columnGap: SPACE.md, alignItems: 'center' },
  btn: { borderRadius: RADIUS.pill, paddingVertical: SPACE.sm, paddingHorizontal: SPACE.lg },
  wide: { flex: 1, borderRadius: RADIUS.pill, paddingVertical: SPACE.md, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: TYPE.footnote },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});

/** Settings → Downloaded texts: what is on the phone, how much space it takes, and delete. */
export function DownloadsSection() {
  const { palette } = useAppState();
  const { installed, jobs } = useDownloads();
  const ids = Object.keys(installed).sort();
  const total = ids.reduce((sum, id) => sum + installed[id].bytes, 0);
  const active = Object.keys(jobs).length;

  const confirmDelete = (id: string, title: string) =>
    Alert.alert(`Delete ${title}?`, `This frees ${formatBytes(installed[id]?.bytes ?? 0)}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDownload(id) },
    ]);

  return (
    <Card style={{ rowGap: SPACE.sm }}>
      {ids.length === 0 ? (
        <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>
          No texts downloaded yet. Open a large text such as the Mahabharata or a Purana and tap Download to read it offline.
        </Text>
      ) : (
        <>
          <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>
            {ids.length} {ids.length === 1 ? 'text' : 'texts'} on this phone, {formatBytes(total)} in all.
            {active ? ` ${active} downloading.` : ''}
          </Text>
          {ids.map((id, i) => {
            const entry = getEntry(id);
            const title = entry?.title ?? id;
            return (
              <View key={id} style={[styles.row, { paddingTop: SPACE.sm }, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>{entry?.titleSanskrit ?? title}</Text>
                  <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                    {title} · {formatBytes(installed[id].bytes)}
                  </Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${title} from this phone`} onPress={() => confirmDelete(id, title)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color={palette.muted} />
                </Pressable>
              </View>
            );
          })}
        </>
      )}
    </Card>
  );
}
