import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginPage, RegisterPage} from '../pages';

const Stack = createNativeStackNavigator();

function PublicRoute() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginPage}
        initialRouteName="Login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default PublicRoute;
