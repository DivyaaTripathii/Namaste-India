import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CombinedScreen from './Src/Screens/CombinedScreen'; // Adjust the import path based on your directory structure
import StateDetailsScreen from './Src/Screens/StateDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CombinedScreen">
        <Stack.Screen name="CombinedScreen" component={CombinedScreen} />
        <Stack.Screen 
          name="StateDetails" 
          component={StateDetailsScreen} 
          options={({ route }) => ({ title: route.params.stateName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}