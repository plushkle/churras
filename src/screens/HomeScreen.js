import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍖 ChurrasApp</Text>
      <Button title="Novo Pedido" onPress={() => navigation.navigate('Novo Pedido')} />
      <Button title="Lista de Pedidos" onPress={() => navigation.navigate('Lista de Pedidos')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, marginBottom: 20 }
});
