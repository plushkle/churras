import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaPedidosScreen() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const carregarPedidos = async () => {
      const dados = await AsyncStorage.getItem('pedidos');
      if (dados) setPedidos(JSON.parse(dados));
    };
    carregarPedidos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Cliente: {item.nome}</Text>
            <Text style={styles.text}>Item: {item.item}</Text>
            <Text style={styles.text}>Qtd: {item.quantidade}</Text>
            <Text style={styles.date}>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  item: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10 },
  text: { fontSize: 16 },
  date: { fontSize: 12, color: '#666' }
});
