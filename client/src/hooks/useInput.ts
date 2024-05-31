import { ChangeEvent, useState } from 'react';

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    update: (val: string) => setValue(val),
    reset: () => setValue(initialValue),
  };
}
