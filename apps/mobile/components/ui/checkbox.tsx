import { Pressable, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox = ({ checked, onCheckedChange, label, className }: CheckboxProps) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onCheckedChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <MaterialCommunityIcons name="check" size={16} color="white" />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

const styles = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
};
