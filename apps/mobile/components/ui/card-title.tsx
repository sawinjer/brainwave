import type { ReactNode } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CardTitleProps {
  children: ReactNode;
}

export const CardTitle = ({ children }: CardTitleProps) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
});
