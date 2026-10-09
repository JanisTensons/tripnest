import { useSyncExternalStore } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export function useColorScheme() {
  const colorScheme = useRNColorScheme();

  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (hasHydrated) {
    return colorScheme;
  }

  return "light";
}
