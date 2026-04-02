import type { ReactNode } from 'react';
import { Text, StyleSheet } from 'react-native';

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
}

export const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <Text style={styles.label}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
});
