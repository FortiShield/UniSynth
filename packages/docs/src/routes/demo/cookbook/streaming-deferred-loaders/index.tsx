import { Resource, component$ } from '@khulnasoft.com/unisynth';
import { routeLoader$ } from '@khulnasoft.com/unisynth-city';

export const useMyData = routeLoader$(() => {
  return async () => {
    await delay(4_000);
    return 'MyData ' + Math.random();
  };
});

const delay = (timeout: number) => {
  return new Promise((res) => setTimeout(res, timeout));
};

export default component$(() => {
  const myData = useMyData();
  return (
    <>
      <div>BEFORE</div>
      <Resource
        value={myData}
        onResolved={(data) => <div>DATA: {data}</div>}
      />
      <div>AFTER</div>
    </>
  );
});
