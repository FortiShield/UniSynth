// Expect error: { "messageId": "referencesOutside" }
import { component$ } from '@khulnasoft.com/unisynth';
export interface Props {
  nonserializableTuple: [string, number, boolean, Function];
}

export const HelloWorld = component$((props: Props) => {
  return <button onClick$={() => props.nonserializableTuple}></button>;
});
