import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardContentProps {
  children: ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <View style={styles.content}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    marginTop: 8,
  },
});
