import { component$, useSignal, useVisibleTask$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const time = useSignal('loading...');
  // eslint-disable-next-line unisynth/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const update = () => (time.value = new Date().toLocaleTimeString());
    update();
    cleanup(clearInterval.bind(null, setInterval(update, 1000)));
  });
  return <div>Time: {time.value}</div>;
});
