//Card / CardHeader / CardContent
import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card text-card-foreground",
        "ring-1 ring-border/50 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle(
  props: React.HTMLAttributes<HTMLHeadingElement> & { className?: string }
) {
  const { className, ...rest } = props;
  return (
    <h3 className={cn("text-sm font-semibold tracking-tight", className)} {...rest} />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
