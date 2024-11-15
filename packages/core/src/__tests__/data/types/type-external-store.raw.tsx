import { useStore } from '@khulnasoft.com/unisynth';
import { FooStore } from './foo-store';

export default function TypeExternalStore() {
  const state = useStore<FooStore>({
    _name: 'test',
  });

  return <div>Hello {state._name}! </div>;
}