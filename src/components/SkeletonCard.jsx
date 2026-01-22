import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

const SkeletonCard = ({ style }) => {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <View 
      style={[
        styles.skeletonCard, 
        { 
          backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
          opacity: 0.6 
        },
        style
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    height: 100,
    borderRadius: 8,
  },
});

export default SkeletonCard;