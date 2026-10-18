import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Hydration-safe mounted flag: no setState-in-effect and no extra render pass. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
