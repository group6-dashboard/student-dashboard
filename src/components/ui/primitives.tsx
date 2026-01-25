import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "link";

type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent",
  ghost: "bg-transparent text-foreground hover:bg-accent/60",
  outline:
    "border border-border/50 bg-transparent text-foreground hover:bg-accent/60",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30",
  link: "bg-transparent text-primary hover:underline underline-offset-4",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", ...props }, ref) => {
    const sizeClass =
      size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-10 w-10";
    return (
      <button
        ref={ref}
        className={cn(buttonBase, buttonVariants[variant], sizeClass, className)}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border/50 text-foreground",
  success: "bg-accent text-foreground",
  warning: "bg-accent text-foreground",
  danger: "bg-destructive/10 text-destructive border border-destructive/30",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
          badgeVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-10 w-full rounded-lg border border-border/50 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[96px] w-full rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border border-border/50 bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium text-foreground", className)}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

type TextVariant = "h1" | "h2" | "h3" | "body" | "muted" | "caption";

const textVariants: Record<TextVariant, string> = {
  h1: "text-3xl font-semibold tracking-tight",
  h2: "text-2xl font-semibold tracking-tight",
  h3: "text-xl font-semibold tracking-tight",
  body: "text-sm text-foreground",
  muted: "text-sm text-muted-foreground",
  caption: "text-xs text-muted-foreground",
};

export interface TextProps
  extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as: Comp = "p", className, variant = "body", ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(textVariants[variant], className)}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement> {}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn("border-0 border-t border-border/50", className)}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-lg bg-muted/60", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
