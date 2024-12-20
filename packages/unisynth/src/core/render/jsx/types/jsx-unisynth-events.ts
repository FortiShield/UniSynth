import type { AllEventKeys } from './jsx-unisynth-attributes';

/** Emitted by unisynth-loader when an element becomes visible. Used by `useVisibleTask$` @public */
export type UnisynthVisibleEvent = CustomEvent<IntersectionObserverEntry>;
/** Emitted by unisynth-loader when a module was lazily loaded @public */
export type UnisynthSymbolEvent = CustomEvent<{
  symbol: string;
  element: Element;
  reqTime: number;
}>;
/** Emitted by unisynth-loader on document when the document first becomes interactive @public */
export type UnisynthInitEvent = CustomEvent<{}>;
/** Emitted by unisynth-loader on document when the document first becomes idle @public */
export type UnisynthIdleEvent = CustomEvent<{}>;

// Utility types for supporting autocompletion in union types

/** Matches any primitive value. */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

/**
 * Allows creating a union type by combining primitive types and literal types without sacrificing
 * auto-completion in IDEs for the literal type part of the union.
 *
 * This type is a workaround for Microsoft/TypeScript#29729. It will be removed as soon as it's not
 * needed anymore.
 *
 * Example:
 *
 * ```ts
 * // Before
 * type Pet = 'dog' | 'cat' | string;
 *
 * const pet: Pet = '';
 * // Start typing in your TypeScript-enabled IDE.
 * // You **will not** get auto-completion for `dog` and `cat` literals.
 *
 * // After
 * type Pet2 = LiteralUnion<'dog' | 'cat', string>;
 *
 * const pet: Pet2 = '';
 * // You **will** get auto-completion for `dog` and `cat` literals.
 * ```
 */
export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

/**
 * The names of events that Unisynth knows about. They are all lowercase, but on the JSX side, they
 * are PascalCase for nicer DX. (`onAuxClick$` vs `onauxclick$`)
 *
 * @public
 */
export type KnownEventNames = LiteralUnion<AllEventKeys, string>;

// Deprecated old types
export type SyntheticEvent<T = Element, E = Event> = E & { target: EventTarget & T };
/** @public @deprecated Use `AnimationEvent` and use the second argument to the handler function for the current event target */
export type NativeAnimationEvent = AnimationEvent;
/** @public @deprecated Use `ClipboardEvent` and use the second argument to the handler function for the current event target */
export type NativeClipboardEvent = ClipboardEvent;
/** @public @deprecated Use `CompositionEvent` and use the second argument to the handler function for the current event target */
export type NativeCompositionEvent = CompositionEvent;
/** @public @deprecated Use `DragEvent` and use the second argument to the handler function for the current event target */
export type NativeDragEvent = DragEvent;
/** @public @deprecated Use `FocusEvent` and use the second argument to the handler function for the current event target */
export type NativeFocusEvent = FocusEvent;
/** @public @deprecated Use `KeyboardEvent` and use the second argument to the handler function for the current event target */
export type NativeKeyboardEvent = KeyboardEvent;
/** @public @deprecated Use `MouseEvent` and use the second argument to the handler function for the current event target */
export type NativeMouseEvent = MouseEvent;
/** @public @deprecated Use `TouchEvent` and use the second argument to the handler function for the current event target */
export type NativeTouchEvent = TouchEvent;
/** @public @deprecated Use `PointerEvent` and use the second argument to the handler function for the current event target */
export type NativePointerEvent = PointerEvent;
/** @public @deprecated Use `TransitionEvent` and use the second argument to the handler function for the current event target */
export type NativeTransitionEvent = TransitionEvent;
/** @public @deprecated Use `UIEvent` and use the second argument to the handler function for the current event target */
export type NativeUIEvent = UIEvent;
/** @public @deprecated Use `WheelEvent` and use the second argument to the handler function for the current event target */
export type NativeWheelEvent = WheelEvent;
/** @public @deprecated Use `AnimationEvent` and use the second argument to the handler function for the current event target */
export type UnisynthAnimationEvent<T = Element> = NativeAnimationEvent;
/** @public @deprecated Use `ClipboardEvent` and use the second argument to the handler function for the current event target */
export type UnisynthClipboardEvent<T = Element> = NativeClipboardEvent;
/** @public @deprecated Use `CompositionEvent` and use the second argument to the handler function for the current event target */
export type UnisynthCompositionEvent<T = Element> = NativeCompositionEvent;
/** @public @deprecated Use `DragEvent` and use the second argument to the handler function for the current event target */
export type UnisynthDragEvent<T = Element> = NativeDragEvent;
/** @public @deprecated Use `PointerEvent` and use the second argument to the handler function for the current event target */
export type UnisynthPointerEvent<T = Element> = NativePointerEvent;
/** @public @deprecated Use `FocusEvent` and use the second argument to the handler function for the current event target */
export type UnisynthFocusEvent<T = Element> = NativeFocusEvent;
/** @public @deprecated Use `SubmitEvent` and use the second argument to the handler function for the current event target */
export type UnisynthSubmitEvent<T = Element> = SubmitEvent;
/** @public @deprecated Use `Event` and use the second argument to the handler function for the current event target */
export type UnisynthInvalidEvent<T = Element> = Event;
/** @public @deprecated Use `Event` and use the second argument to the handler function for the current event target. Also note that in Unisynth, onInput$ with the InputEvent is the event that behaves like onChange in React. */
export type UnisynthChangeEvent<T = Element> = Event;
/** @public @deprecated Use `KeyboardEvent` and use the second argument to the handler function for the current event target */
export type UnisynthKeyboardEvent<T = Element> = NativeKeyboardEvent;
/** @public @deprecated Use `MouseEvent` and use the second argument to the handler function for the current event target */
export type UnisynthMouseEvent<T = Element, E = NativeMouseEvent> = E;
/** @public @deprecated Use `TouchEvent` and use the second argument to the handler function for the current event target */
export type UnisynthTouchEvent<T = Element> = NativeTouchEvent;
/** @public @deprecated Use `UIEvent` and use the second argument to the handler function for the current event target */
export type UnisynthUIEvent<T = Element> = NativeUIEvent;
/** @public @deprecated Use `WheelEvent` and use the second argument to the handler function for the current event target */
export type UnisynthWheelEvent<T = Element> = NativeWheelEvent;
/** @public @deprecated Use `TransitionEvent` and use the second argument to the handler function for the current event target */
export type UnisynthTransitionEvent<T = Element> = NativeTransitionEvent;
