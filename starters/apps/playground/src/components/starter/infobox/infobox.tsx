import { Slot, component$ } from "@khulnasoft.com/unisynth";
import styles from "./infobox.module.css";

export default component$(() => {
  return (
    <div class={styles.infobox}>
      <h3>
        <Slot name="title" />
      </h3>
      <Slot />
    </div>
  );
});
