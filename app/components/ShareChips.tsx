import { MessageCircle, Send } from 'lucide-react';
import { ShareButton } from '@/app/components/ShareButton';
import { absUrl } from '@/lib/jsonld';
import { whatsappShareUrl } from '@/lib/whatsapp';

/**
 * Universal Multi-Platform Share Chips:
 * WhatsApp, X (Twitter), Telegram, and Native Share sheet with 1-tap clipboard fallback.
 * Built for zero runtime penalty with lightweight semantic anchors.
 */
export function ShareChips({
  title,
  summary,
  path,
  tone = 'light',
  className = '',
}: {
  /** Name of the thing being shared: "Karma Yoga". */
  title: string;
  /** One-paragraph description; trimmed to ~180 characters. */
  summary?: string;
  /** Site path of the page: "/concepts/karma". */
  path: string;
  /** `dark` chips sit on a coloured hero, `light` on a card. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const flat = (summary ?? '').replace(/\s+/g, ' ').trim();
  const text = flat.length > 180 ? `${flat.slice(0, 179).trimEnd()}…` : flat;
  const url = absUrl(path);
  const heading = `${title} · Dharma Granth`;
  const chip =
    'inline-flex min-h-[44px] items-center gap-1.5 px-3.5 rounded-full text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 ' +
    (tone === 'dark'
      ? 'bg-white/15 hover:bg-white/25 backdrop-blur text-white focus-visible:outline-white'
      : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300 focus-visible:outline-saffron-600');

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text ? `${heading}\n\n${text}` : heading
  )}&url=${encodeURIComponent(url)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
    text ? `${heading}\n${text}` : heading
  )}`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={whatsappShareUrl({ heading, body: text ? [text] : [], url })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on WhatsApp`}
        className={chip}
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on X (Twitter)`}
        className={chip}
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X</span>
      </a>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on Telegram`}
        className={chip}
      >
        <Send className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Telegram</span>
      </a>

      <ShareButton title={heading} text={text} url={url} className={chip}>
        Share
      </ShareButton>
    </div>
  );
}
