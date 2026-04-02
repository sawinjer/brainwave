import { View, StyleSheet } from 'react-native';

export const Separator = ({ className }: { className?: string }) => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
});
