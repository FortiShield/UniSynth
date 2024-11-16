import { component$ } from "@khulnasoft.com/unisynth";
import { Form, routeAction$ } from "@khulnasoft.com/unisynth-city";
import { data } from "./data";

export const useRootAction = routeAction$(
  (form, { redirect }) => {
    const name = form.name as string;
    data.length = 0;
    data.push(name);
    throw redirect(303, "/unisynthcity-test/issue2644/other/");
  },
  {
    id: "root-action",
  },
);

export default component$(() => {
  const action = useRootAction();
  return (
    <Form action={action} spaReset>
      <input name="name" id="issue2644-input" />
      <button id="issue2644-submit">Submit</button>
    </Form>
  );
});
