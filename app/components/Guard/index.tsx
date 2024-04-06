import { PropsWithChildren, ReactNode, useMemo } from "react";

export interface GuardProps extends PropsWithChildren {
  when: boolean;
}

const Guard = (props: GuardProps) => {
  const { when, children } = props;

  if (when) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

type Stricted<T extends Record<string, unknown>> = {
  [key in keyof T]-?: NonNullable<T[key]>;
};

export interface GuardV2Props<T> {
  data: T;
  dataCheck?: (data: T) => boolean;
  children: (data: NonNullable<T>) => ReactNode;
  fallback?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const GuardV2 = <T extends unknown>(props: GuardV2Props<T>) => {
  const { data, dataCheck, fallback, children } = props;

  if (!!dataCheck && dataCheck(data)) {
    return children(data as NonNullable<T>);
  }
  if (!data && !fallback) {
    return <></>;
  }
  if (!data && !!fallback) {
    return fallback;
  }
  return children(data as NonNullable<T>);
};

export interface GuardV3Props<T extends Record<string, unknown>> {
  data?: T;
  when?: boolean;
  children: (afterCheck: { data: Stricted<T>; when: boolean }) => ReactNode;
  fallback?: ReactNode;
}

export const GuardV3 = <T extends Record<string, unknown>>(
  props: GuardV3Props<T>
) => {
  const { data = {} as T, when = false, fallback, children } = props;

  const isOk = useMemo(() => {
    if (!when) {
      return false;
    }
    const values = Object.values(data);
    return values.every((value) => value !== undefined && value !== null);
  }, [data, when]);
  if (!isOk && !fallback) {
    return <></>;
  }
  if (!isOk && !!fallback) {
    return fallback;
  }
  return children({ data, when } as { data: Stricted<T>; when: boolean });
};

export default Guard;
