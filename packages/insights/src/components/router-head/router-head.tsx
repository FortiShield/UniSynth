import { component$ } from '@khulnasoft.com/unisynth';
import { useDocumentHead, useLocation } from '@khulnasoft.com/unisynth-city';

/** The RouterHead component is placed inside of the document `<head>` element. */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...(s.props as any)} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});