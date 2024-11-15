import Context1 from '@dummy/1';
import Context2 from '@dummy/2';
import { setContext, useContext } from '@khulnasoft.com/unisynth';

export default function ComponentWithContext(props: { content: string }) {
  const foo = useContext(Context1);

  setContext(Context1, {
    foo: 'bar',
    content() {
      return props.content;
    },
  });

  return (
    <Context2.Provider value={{ bar: 'baz' }}>
      <>{foo.value}</>
    </Context2.Provider>
  );
}