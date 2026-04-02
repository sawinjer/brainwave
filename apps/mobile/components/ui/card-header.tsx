import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardHeaderProps {
  children: ReactNode;
}

export const CardHeader = ({ children }: CardHeaderProps) => {
  return <View style={styles.header}>{children}</View>;
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
});
