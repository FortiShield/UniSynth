import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
  type NoSerialize,
} from '@khulnasoft.com/unisynth';
import type Monaco from './monaco';
import { monacoEditor } from './monaco';

export default component$(() => {
  const editorRef = useSignal<HTMLElement>();
  const store = useStore<{ monacoInstance: NoSerialize<Monaco> }>({
    monacoInstance: undefined,
  });

  // eslint-disable-next-line unisynth/no-use-visible-task
  useVisibleTask$(() => {
    const editor = monacoEditor.create(editorRef.value!, {
      value: 'Hello, world!',
    });
    // Monaco is not serializable, so we can't serialize it as part of SSR
    // We can however instantiate it on the client after the component is visible
    store.monacoInstance = noSerialize(editor);
  });
  return <div ref={editorRef}>loading...</div>;
});
