import { component$, useContext } from "@khulnasoft.com/unisynth";
import { SomeContext } from "../../../components/provider/provider";

export default component$(() => {
  const someContext = useContext(SomeContext);
  return (
    <div>
      <h1>Profile</h1>
      <p id="issue2829-context">context: {someContext.value}</p>
    </div>
  );
});
