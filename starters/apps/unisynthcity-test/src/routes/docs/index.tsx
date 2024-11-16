import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <h1>Welcome to the Docs!</h1>

      <p>
        <a href="/unisynthcity-test/docs">
          Docs link with trailing slash (should redirect without slash)
        </a>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome!",
};
