import { component$, useStore } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const counter = useStore({ count: 0 });

  return (
    <>
      <p>Count: {counter.count}</p>
      <button onClick$={() => counter.count++}>+1</button>
    </>
  );
});
