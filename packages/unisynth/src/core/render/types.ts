import type { ContainerState } from '../container/container';
import type { QContext } from '../state/context';
import type { UnisynthElement } from './dom/virtual-element';

/** @public */
export interface RenderOperation {
  $operation$: (...args: any[]) => void;
  $args$: any[];
}

/** @public */
export interface RenderContext {
  readonly $static$: RenderStaticContext;
  /** Current Unisynth component */
  $cmpCtx$: QContext | null;
  /** Current Slot parent */
  $slotCtx$: QContext | undefined;
}

export interface RenderStaticContext {
  readonly $locale$: string;
  readonly $doc$: Document;
  readonly $roots$: QContext[];
  readonly $hostElements$: Set<UnisynthElement>;
  readonly $visited$: (Node | UnisynthElement)[];
  readonly $operations$: RenderOperation[];
  readonly $postOperations$: RenderOperation[];
  readonly $containerState$: ContainerState;
  readonly $addSlots$: [UnisynthElement, UnisynthElement][];
  readonly $rmSlots$: UnisynthElement[];
}

// Polyfills for ViewTransition API & scroll restoration
declare global {
  interface ViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  }

  interface Document {
    startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
    __q_view_transition__?: true | undefined;
    __q_scroll_restore__?: (() => void) | undefined;
  }
}
