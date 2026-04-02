import type { ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

interface FieldProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const Field = ({ children, className, style }: FieldProps) => {
  return <View style={[styles.field, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
});
