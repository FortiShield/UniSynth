/* eslint-disable */
import {
  component$,
  useStore,
  createContextId,
  useContextProvider,
} from "@khulnasoft.com/unisynth";

export const LOGS = createContextId<{ content: string }>(
  "unisynth.logs.resource",
);

export const TreeshakingApp = component$(() => {
  const logs = {
    content: "",
  };
  useContextProvider(LOGS, logs);

  const state = useStore({
    text: "text",
  });
  return (
    <div>
      <Child text={state} />
    </div>
  );
});

export const Child = component$((props: { text: { text: string } }) => {
  const state = useStore({
    text: "child",
  });

  return (
    <div>
      <span onClick$={() => console.log("hola")}>Text: {props.text.text}</span>
      <span>Child: {state.text}</span>
    </div>
  );
});
