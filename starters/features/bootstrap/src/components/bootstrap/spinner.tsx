import { component$ } from "@khulnasoft.com/unisynth";
import { type BsSpinnerComponentProps } from "~/models/bootstrap";

export const Spinner = component$<BsSpinnerComponentProps>(
  ({ text, colorVariant, growing }) => (
    <div
      class={`spinner-${growing ? "grow" : "border"} text-${colorVariant}`}
      role="status"
    >
      <span class="visually-hidden">{text || "Loading..."}</span>
    </div>
  ),
);
