import React from "react";

type Direction = "row" | "column";
type Justify = "start" | "center" | "end";
type Align = "start" | "center" | "end" | "stretch";

interface StackProps {
  direction?: Direction;
  justify?: Justify;
  align?: Align;
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
}

const directionMap: Record<Direction, string> = {
  row: "flex-row",
  column: "flex-col",
};

const justifyMap: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

const alignMap: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const gapMap = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
};

export function Stack({
  direction = "column",
  justify = "start",
  align = "start",
  gap = "0",
  fullWidth = false,
  className = "",
  children,
  ref,
}: StackProps) {
  const classes = [
    "flex",
    directionMap[direction],
    justifyMap[justify],
    alignMap[align],
    gapMap[gap],
    fullWidth ? "w-full" : "w-fit",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}

export default Stack;
