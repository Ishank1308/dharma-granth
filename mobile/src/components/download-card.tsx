import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { accentFill, Card, glass } from '@/components/ui';
import { getEntry, webUrl } from '@/content/catalog';
import {
  cancelDownload,
  deleteDownload,
  formatBytes,
  startDownload,
  useDownloads,
  useRemoteIndex,
  type DownloadErrorCode,
} from '@/content/downloads';
import type { CatalogEntry } from '@/content/types';
import { S, useI18n, type Msg } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { RADIUS, SPACE, TOUCH, TYPE } from '@/theme/themes';

/** The sentence for a failed download. `bytes` is the text's size on the phone, for the free-space message. */
export function downloadErrorText(code: DownloadErrorCode, bytes: number): Msg {
  switch (code) {
    case 'offline':
      return S.downloadErrOffline;
    case 'server':
      return S.downloadErrServer;
    case 'space':
      return S.downloadErrSpace(formatBytes(Math.round(bytes * 1.35)));
    case 'damaged':
      return S.downloadErrDamaged;
    case 'incomplete':
      return S.downloadErrIncomplete;
    case 'unavailable':
      return S.downloadNotYet;
    case 'update':
      return S.downloadErrUpdate;
    default:
      return S.downloadErrFailed;
  }
}

/** Download, progress, update and delete for one large text, shown at the top of its chapter list. */
export function DownloadCard({ entry }: { entry: CatalogEntry }) {
  useRemoteIndex();
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { installed, jobs, errors, index, indexStatus } = useDownloads();
  const id = entry.id;
  const mine = installed[id];
  const job = jobs[id];
  const remote = index?.books[id];
  const error = errors[id] ? t(downloadErrorText(errors[id], remote?.bytes ?? 0)) : undefined;
  const update = Boolean(mine && remote && remote.version !== mine.version);

  const title = { color: palette.text, fontSize: TYPE.callout, fontWeight: '600' } as const;
  const note = { color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 } as const;

  const confirmDelete = () =>
    Alert.alert(t(S.deleteDownloadTitle(entry.title)), t(S.deleteDownloadBody(formatBytes(mine?.bytes ?? 0))), [
      { text: t(S.cancel), style: 'cancel' },
      { text: t(S.deleteBtn), style: 'destructive', onPress: () => deleteDownload(id) },
    ]);

  if (job) {
    const pct = job.total > 0 ? Math.min(100, Math.round((job.received / job.total) * 100)) : 0;
    return (
      <Card style={{ rowGap: SPACE.sm }}>
        <View style={styles.row}>
          <Ionicons name="cloud-download-outline" size={22} color={palette.accent} />
          <View style={{ flex: 1 }}>
            <Text style={title}>{t(S.downloading(pct))}</Text>
            <Text style={note}>
              {job.total > 0 ? t(S.downloadProgress(formatBytes(job.received), formatBytes(job.total))) : t(S.downloadStarting)}
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={t(S.cancelDownloadA11y)} onPress={() => cancelDownload(id)} style={[styles.btn, glass(palette, true)]}>
            <Text style={[styles.btnText, { color: palette.text }]}>{t(S.cancel)}</Text>
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
          <Text style={title}>{t(S.downloadedSize(formatBytes(mine.bytes)))}</Text>
          <Text style={note}>{t(update ? S.downloadUpdateAvailable : S.downloadReady)}</Text>
          {error ? (
            <Text accessibilityLiveRegion="polite" style={[note, { color: palette.accent }]}>
              {error}
            </Text>
          ) : null}
        </View>
        {update ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t(S.updateDownloadA11y)} onPress={() => startDownload(id)} style={[styles.btn, accentFill(palette)]}>
            <Text style={[styles.btnText, { color: palette.onAccent }]}>{t(S.updateBtn)}</Text>
          </Pressable>
        ) : null}
        <Pressable accessibilityRole="button" accessibilityLabel={t(S.deleteFromPhoneA11y(entry.title))} onPress={confirmDelete} style={styles.icon}>
          <Ionicons name="trash-outline" size={20} color={palette.muted} />
        </Pressable>
      </Card>
    );
  }

  const size = remote ? t(S.downloadSize(formatBytes(remote.gz), formatBytes(remote.bytes))) : null;
  return (
    <Card style={{ rowGap: SPACE.md }}>
      <View style={styles.row}>
        <Ionicons name="cloud-download-outline" size={22} color={palette.accent} />
        <View style={{ flex: 1 }}>
          <Text style={title}>{t(S.downloadTitle)}</Text>
          <Text style={note}>
            {size ??
              (indexStatus === 'error'
                ? t(S.downloadOffline)
                : indexStatus === 'ready'
                  ? t(S.downloadNotYet)
                  : t(S.downloadChecking))}
          </Text>
          {error ? (
            <Text accessibilityLiveRegion="polite" style={[note, { color: palette.accent }]}>
              {error}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', columnGap: SPACE.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(S.downloadA11y(entry.title))}
          disabled={indexStatus === 'ready' && !remote}
          onPress={() => startDownload(id)}
          style={[styles.wide, accentFill(palette), indexStatus === 'ready' && !remote && { opacity: 0.5 }]}>
          <Text style={[styles.btnText, { color: palette.onAccent }]}>{t(S.downloadBtn)}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t(S.readOnWebsite)}
          onPress={() => Linking.openURL(webUrl(id)).catch(() => {})}
          style={[styles.wide, glass(palette, true)]}>
          <Text style={[styles.btnText, { color: palette.text }]}>{t(S.readOnline)}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', columnGap: SPACE.md, alignItems: 'center' },
  // Every control is at least 48 dp tall (Android's minimum touch target).
  btn: { minHeight: TOUCH, justifyContent: 'center', borderRadius: RADIUS.pill, paddingVertical: SPACE.sm, paddingHorizontal: SPACE.lg },
  wide: { flex: 1, minHeight: TOUCH, justifyContent: 'center', borderRadius: RADIUS.pill, paddingVertical: SPACE.sm, alignItems: 'center' },
  icon: { width: TOUCH, height: TOUCH, marginRight: -SPACE.sm, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '700', fontSize: TYPE.footnote },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});

/** Settings → Downloaded texts: what is on the phone, how much space it takes, and delete. */
export function DownloadsSection() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { installed, jobs } = useDownloads();
  const ids = Object.keys(installed).sort();
  const total = ids.reduce((sum, id) => sum + installed[id].bytes, 0);
  const active = Object.keys(jobs).length;

  const confirmDelete = (id: string, title: string) =>
    Alert.alert(t(S.deleteDownloadTitle(title)), t(S.deleteDownloadBody(formatBytes(installed[id]?.bytes ?? 0))), [
      { text: t(S.cancel), style: 'cancel' },
      { text: t(S.deleteBtn), style: 'destructive', onPress: () => deleteDownload(id) },
    ]);

  return (
    <Card style={{ rowGap: SPACE.sm }}>
      {ids.length === 0 ? (
        <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{t(S.downloadsEmpty)}</Text>
      ) : (
        <>
          <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{t(S.downloadsSummary(ids.length, formatBytes(total), active))}</Text>
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
                <Pressable accessibilityRole="button" accessibilityLabel={t(S.deleteFromPhoneA11y(title))} onPress={() => confirmDelete(id, title)} style={styles.icon}>
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
