import { component$, useTask$ } from '@khulnasoft.com/unisynth';

export const HelloWorld = component$(() => {
  const getMethod = () => {
    return 'value';
  };
  const useMethod = getMethod();
  useTask$(() => {
    // eslint-disable-next-line no-console
    console.log(useMethod);
  });
  return <div></div>;
});
