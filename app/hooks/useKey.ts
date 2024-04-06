export interface UseKeyProps<Args extends Record<string, unknown>> {
  name: string;
  args?: Args;
}

const useKey = <Args extends Record<string, unknown>>(
  name: string,
  args?: Args
) => {
  return [
    {
      name,
      ...args,
    },
  ] as const;
};

export default useKey;
