import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: ReactNode;
}

export const Alert = ({ variant = 'default', children }: AlertProps) => {
  return (
    <View style={[styles.alert, variant === 'destructive' && styles.destructive]}>
      {children}
    </View>
  );
};

interface AlertTitleProps {
  children: ReactNode;
}

export const AlertTitle = ({ children }: AlertTitleProps) => {
  return <Text style={styles.title}>{children}</Text>;
};

interface AlertDescriptionProps {
  children: ReactNode;
}

export const AlertDescription = ({ children }: AlertDescriptionProps) => {
  return <Text style={styles.description}>{children}</Text>;
};

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  destructive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
});
