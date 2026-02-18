import type React from "react";
import { useState } from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(
    getValueFromLocalStorage(key, defaultValue),
  );

  const onValueChange: React.Dispatch<React.SetStateAction<T>> = (change) => {
    setValue((prevValue) => {
      const newValue =
        typeof change === "function"
          ? (change as (v: T) => T)(prevValue)
          : change;

      setValueToLocalStorage(key, newValue);

      return newValue;
    });
  };

  return [value, onValueChange] as const;
};

const getValueFromLocalStorage = <T>(key: string, defaultValue: T) => {
  const valueFromLocalStorage = localStorage.getItem(key);
  let parsedValueFromLocalStorage: T;

  if (valueFromLocalStorage) {
    try {
      parsedValueFromLocalStorage = JSON.parse(valueFromLocalStorage);
    } catch {
      setValueToLocalStorage(key, defaultValue);
      parsedValueFromLocalStorage = defaultValue;
    }
  } else {
    setValueToLocalStorage(key, defaultValue);
    parsedValueFromLocalStorage = defaultValue;
  }

  return parsedValueFromLocalStorage as T;
};

const setValueToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};
