import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef, useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "destructive"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends ComponentPropsWithoutRef<typeof Pressable> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: "#6366f1" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  secondary: { backgroundColor: "#e5e7eb" },
  destructive: { backgroundColor: "#ef4444" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const textStyles: Record<ButtonVariant, TextStyle> = {
  default: { color: "white" },
  outline: { color: "#374151" },
  secondary: { color: "#374151" },
  destructive: { color: "white" },
  ghost: { color: "#6366f1" },
  link: { color: "#6366f1" },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  sm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  lg: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 },
  icon: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8 },
};

export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      className,
      children,
      disabled,
      style,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = useState(false);

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          variantStyles[variant],
          sizeStyles[size],
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          },
          disabled && styles.disabled,
          pressed && styles.pressed,
          style,
        ]}
        {...props}
      >
        <Text style={[textStyles[variant], disabled && styles.disabledText]}>
          {children}
        </Text>
      </Pressable>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
  },
});
