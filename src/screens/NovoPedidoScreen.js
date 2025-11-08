import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NovoPedidoScreen() {
  const [nome, setNome] = useState('');
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const salvarPedido = async () => {
    if (!nome || !item || !quantidade) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    const pedido = { nome, item, quantidade, data: new Date().toLocaleString() };
    const pedidosSalvos = JSON.parse(await AsyncStorage.getItem('pedidos')) || [];
    pedidosSalvos.push(pedido);
    await AsyncStorage.setItem('pedidos', JSON.stringify(pedidosSalvos));
    Alert.alert('Sucesso', 'Pedido salvo com sucesso!');
    setNome(''); setItem(''); setQuantidade('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Pedido</Text>
      <TextInput style={styles.input} placeholder="Nome do cliente" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Item" value={item} onChangeText={setItem} />
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <Button title="Salvar Pedido" onPress={salvarPedido} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});
