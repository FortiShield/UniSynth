// Expect error: { "messageId": "referencesOutside" }
import { component$, useTask$ } from '@khulnasoft.com/unisynth';

export const HelloWorld = component$(() => {
  class Stuff {}
  const stuff = new Stuff();
  useTask$(() => {
    // eslint-disable-next-line no-console
    console.log(stuff);
  });
  return <div></div>;
});
