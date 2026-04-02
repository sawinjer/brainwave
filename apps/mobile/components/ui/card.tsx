import type { ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const Card = ({ children, className, style }: CardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
