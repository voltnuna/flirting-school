import { Dispatch, SetStateAction, useCallback, useState } from "react";

/* interface ReturnType {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
} */

type ReturnType<T> = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  () => void,
  () => void,
  () => void
];

const useBoolean = <T>(defaultValue?: boolean): ReturnType<T> => {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((x) => !x), []);

  return [value, setValue, setTrue, setFalse, toggle];
};

export default useBoolean;
