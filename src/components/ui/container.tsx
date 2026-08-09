import type { ReactNode } from "react";

type ContainerElement = "div" | "footer" | "header";
type ContainerSize = "standard" | "text" | "wide";

type ContainerProps = Readonly<{
  as?: ContainerElement;
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
}>;

export function Container({
  as: Component = "div",
  children,
  className,
  size = "standard",
}: ContainerProps) {
  const containerClassName = `container container--${size}`;
  const classes =
    className === undefined
      ? containerClassName
      : `${containerClassName} ${className}`;

  return <Component className={classes}>{children}</Component>;
}
