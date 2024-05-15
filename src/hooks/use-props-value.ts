import { SetStateAction, useMemo, useRef } from "react";
import { useMemoizedFn, useUpdate } from "ahooks";

type Options<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
};

export function usePropsValue<T>(props: Options<T>) {
  const { value, defaultValue, onChange } = props;
  const isControlled = props.hasOwnProperty("value");
  const initialValue = useMemo(() => {
    if (isControlled) {
      return value;
    }
    return defaultValue;
  }, [defaultValue, value]);

  const stateRef = useRef<T>(initialValue!);
  if (isControlled) {
    stateRef.current = value as T;
  }

  const update = useUpdate();

  function setState(v: SetStateAction<T>) {
    const r =
      typeof v === "function"
        ? (v as (prevState: T) => T)(stateRef.current)
        : v;
    if (!isControlled) {
      stateRef.current = r;
      update();
    }
    if (typeof onChange === "function") {
      onChange(r);
    }
  }

  return [stateRef.current, useMemoizedFn(setState)] as const;
}
