import { Slot } from '@khulnasoft.com/unisynth';
import ContentSlotCode from './content-slot-jsx.raw';

type Props = { [key: string]: string };

export default function SlotCode(props: Props) {
  return (
    <div>
      <ContentSlotCode>
        <Slot testing={<div>Hello</div>}></Slot>
      </ContentSlotCode>
    </div>
  );
}