import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { TextInput, type TextStyle } from "react-native";

type InputProps = ComponentPropsWithoutRef<typeof TextInput>;

interface Props extends InputProps {
  className?: string;
}

const baseStyles: TextStyle = {
  borderWidth: 1,
  borderColor: "#d1d5db",
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 14,
  fontSize: 16,
  backgroundColor: "white",
  width: "100%",
};

export const Input = forwardRef<ElementRef<typeof TextInput>, Props>(
  ({ className, style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor="#9ca3af"
        style={[baseStyles, style]}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
