import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Chip } from 'react-native-paper';
import { theme, spacing } from '../theme';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const allCategories = ['All', ...categories];

  const renderCategory = ({ item }: { item: string }) => (
    <Chip
      selected={selectedCategory === item || (item === 'All' && !selectedCategory)}
      onPress={() => onCategorySelect(item === 'All' ? null : item)}
      style={styles.categoryChip}
      textStyle={styles.chipText}
    >
      {item}
    </Chip>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allCategories}
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
  },
  categoryChip: {
    marginRight: spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  chipText: {
    fontSize: 12,
  },
});

export default CategoryFilter; 