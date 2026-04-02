import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FieldSetProps {
  children: ReactNode;
}

export const FieldSet = ({ children }: FieldSetProps) => {
  return <View style={styles.fieldset}>{children}</View>;
};

interface FieldLegendProps {
  children: ReactNode;
}

export const FieldLegend = ({ children }: FieldLegendProps) => {
  return <Text style={styles.legend}>{children}</Text>;
};

interface FieldDescriptionProps {
  children: ReactNode;
}

export const FieldDescription = ({ children }: FieldDescriptionProps) => {
  return <Text style={styles.description}>{children}</Text>;
};

const styles = StyleSheet.create({
  fieldset: {
    gap: 8,
  },
  legend: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});
