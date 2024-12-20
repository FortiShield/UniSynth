import { ManifestIcon } from '../icons/manifest';
import { component$ } from '@khulnasoft.com/unisynth';

export const ManifestTile = component$<{ hash: string }>(({ hash }) => {
  return (
    <code>
      <ManifestIcon />
      <span class="ml-1">{hash}</span>
    </code>
  );
});
