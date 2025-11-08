import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import NovoPedidoScreen from './src/screens/NovoPedidoScreen';
import ListaPedidosScreen from './src/screens/ListaPedidosScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Novo Pedido" component={NovoPedidoScreen} />
        <Stack.Screen name="Lista de Pedidos" component={ListaPedidosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
