import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface FieldGroupProps {
  children: ReactNode;
  className?: string;
}

export const FieldGroup = ({ children, className }: FieldGroupProps) => {
  return <View style={styles.group}>{children}</View>;
};

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
});
