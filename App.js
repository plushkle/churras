import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2, CheckCircle, ChefHat, PlusCircle, List, Flame } from 'lucide-react-native';
import "./global.css"; // Importação OBRIGATÓRIA para NativeWind v4

// Este é o componente principal que o index.js registra
export default function App() {
    return (
        // Usa SafeAreaProvider do pacote correto para envolver toda a aplicação
        <SafeAreaProvider>
            <ChurrasAppLogic />
        </SafeAreaProvider>
    );
}

function ChurrasAppLogic() {
    const [tela, setTela] = useState('lista'); // 'lista' | 'cadastro'
    const [pedidos, setPedidos] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Estados do Formulário
    const [nomeCliente, setNomeCliente] = useState('');
    const [tamanho, setTamanho] = useState('Pequena');
    const [proteina, setProteina] = useState('Carne'); // Será "Linguiça" ao selecionar

    useEffect(() => {
        carregarPedidos();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const salvar = async () => {
            try {
                // Verifica se há dados para evitar salvar nulo
                if (pedidos.length > 0) {
                    await AsyncStorage.setItem('@churrasapp_v2', JSON.stringify(pedidos));
                }
            } catch (e) {
                console.error("Erro ao salvar:", e);
            }
        };
        salvar();
    }, [pedidos, isLoaded]);

    const carregarPedidos = async () => {
        try {
            const json = await AsyncStorage.getItem('@churrasapp_v2');
            if (json) setPedidos(JSON.parse(json));
        } catch (e) {
            console.error("Erro ao carregar:", e);
        } finally {
            setIsLoaded(true);
        }
    };

    const adicionarPedido = () => {
        if (!nomeCliente.trim()) {
            Alert.alert("Atenção", "Faltou o nome do cliente!");
            return;
        }
        const novo = {
            id: Date.now().toString(),
            cliente: nomeCliente,
            tamanho,
            proteina,
            status: 'Pendente',
            data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setPedidos([novo, ...pedidos]);
        setNomeCliente('');
        setTela('lista');
    };

    const toggleStatus = (id) => {
        setPedidos(pedidos.map(p => p.id === id ? { ...p, status: p.status === 'Pendente' ? 'Entregue' : 'Pendente' } : p));
    };

    const remover = (id) => {
        Alert.alert(
            "Remover Pedido",
            "Tem certeza?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim, remover", style: "destructive", onPress: () => setPedidos(pedidos.filter(p => p.id !== id)) }
            ]
        );
    };

    // --- Componentes de UI ---

    const renderHeader = () => (
        <View className="bg-orange-600 pt-6 pb-6 px-6 rounded-b-3xl shadow-lg z-10">
            <StatusBar barStyle="light-content" backgroundColor="#ea580c" />
            <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center gap-3">
                    <View className="bg-white/20 p-2 rounded-full">
                        <Flame size={28} color="white" fill="white" />
                    </View>
                    <View>
                        <Text className="text-white text-2xl font-extrabold tracking-tight">ChurrasApp</Text>
                        <Text className="text-orange-100 text-xs font-medium uppercase tracking-widest">Controle de Marmitas</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderForm = () => (
        <ScrollView className="flex-1 px-5 pt-6 bg-gray-50">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Novo Pedido</Text>

            <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Cliente</Text>
                <TextInput
                    className="w-full text-xl font-semibold text-gray-800 border-b-2 border-gray-100 py-2 focus:border-orange-500"
                    placeholder="Nome do cliente..."
                    placeholderTextColor="#cbd5e1"
                    value={nomeCliente}
                    onChangeText={setNomeCliente}
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Tamanho</Text>
                <View className="flex-row gap-4">
                    {['Pequena', 'Grande'].map(t => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setTamanho(t)}
                            className={`flex-1 py-4 rounded-2xl items-center border-2 ${tamanho === t ? 'bg-orange-500 border-orange-500 shadow-orange-200 shadow-lg' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`font-bold text-lg ${tamanho === t ? 'text-white' : 'text-gray-400'}`}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-8">
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Carne Principal</Text>
                <View className="flex-col gap-3">
                    {['Carne', 'Frango', 'Linguiça'].map(p => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => setProteina(p)}
                            className={`flex-row items-center p-4 rounded-2xl border-2 ${proteina === p ? 'bg-white border-red-500 shadow-md' : 'bg-white border-gray-100'}`}
                        >
                            <View className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${proteina === p ? 'border-red-500' : 'border-gray-300'}`}>
                                {proteina === p && <View className="w-3 h-3 rounded-full bg-red-500" />}
                            </View>
                            <Text className={`font-bold text-lg ${proteina === p ? 'text-gray-800' : 'text-gray-400'}`}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={adicionarPedido}
                className="bg-gray-900 py-4 rounded-2xl items-center shadow-xl active:scale-95 mb-32"
            >
                <Text className="text-white font-bold text-lg">Adicionar à Fila</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderLista = () => (
        <ScrollView className="flex-1 px-5 pt-6 bg-gray-50">
            <View className="flex-row justify-between items-end mb-6">
                <View>
                    <Text className="text-3xl font-bold text-gray-800">{pedidos.filter(p => p.status === 'Pendente').length}</Text>
                    <Text className="text-gray-500 font-medium text-sm">Pendentes</Text>
                </View>
                <View className="items-end">
                    <Text className="text-xl font-bold text-green-600">{pedidos.filter(p => p.status === 'Entregue').length}</Text>
                    <Text className="text-gray-400 text-xs">Entregues</Text>
                </View>
            </View>

            {!isLoaded ? (
                <Text className="text-center text-gray-400 mt-10">Carregando...</Text>
            ) : pedidos.length === 0 ? (
                <View className="items-center justify-center mt-20 opacity-40">
                    <ChefHat size={80} color="#cbd5e1" />
                    <Text className="text-gray-400 font-medium mt-4 text-lg">Cozinha Livre!</Text>
                    <Text className="text-gray-400 text-sm">Nenhum pedido na fila.</Text>
                </View>
            ) : (
                pedidos.map(p => (
                    <View key={p.id} className={`bg-white p-5 rounded-2xl mb-4 border shadow-sm ${p.status === 'Entregue' ? 'border-gray-100 opacity-60 bg-gray-50' : 'border-orange-100 shadow-orange-100'}`}>
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className={`font-bold text-xl ${p.status === 'Entregue' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{p.cliente}</Text>
                                <Text className="text-xs text-gray-400 font-medium mt-1">Pedido às {p.data}</Text>
                            </View>
                            <View className={`px-3 py-1 rounded-full ${p.status === 'Entregue' ? 'bg-green-100' : 'bg-orange-100'}`}>
                                <Text className={`text-xs font-bold ${p.status === 'Entregue' ? 'text-green-700' : 'text-orange-700'}`}>
                                    {p.status === 'Entregue' ? 'FEITO' : 'PREPARANDO'}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row gap-2 mt-4 mb-4">
                            <Text className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-semibold">{p.tamanho}</Text>
                            <Text className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">{p.proteina}</Text>
                        </View>

                        <View className="flex-row gap-3 pt-3 border-t border-gray-50">
                            <TouchableOpacity onPress={() => remover(p.id)} className="flex-1 bg-gray-100 py-3 rounded-xl items-center flex-row justify-center gap-2">
                                <Trash2 size={18} className="text-gray-500" />
                                <Text className="text-gray-600 font-bold text-sm">Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => toggleStatus(p.id)}
                                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center gap-2 ${p.status === 'Entregue' ? 'bg-gray-200' : 'bg-green-500 shadow-lg shadow-green-200'}`}
                            >
                                {p.status === 'Entregue' ? (
                                    <Text className="text-gray-500 font-bold text-sm">Reabrir</Text>
                                ) : (
                                    <>
                                        <CheckCircle size={18} color="white" />
                                        <Text className="text-white font-bold text-sm">Pronto</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
            <View className="h-32" />
        </ScrollView>
    );

    const renderNavbar = () => (
        <View className="absolute bottom-6 left-6 right-6 bg-gray-900 rounded-2xl flex-row p-2 shadow-2xl shadow-gray-400 z-50">
            <TouchableOpacity
                onPress={() => setTela('lista')}
                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center gap-2 ${tela === 'lista' ? 'bg-orange-500' : 'bg-transparent'}`}
            >
                <List size={20} color={tela === 'lista' ? 'white' : '#94a3b8'} />
                {tela === 'lista' && <Text className="text-white font-bold text-sm">Pedidos</Text>}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setTela('cadastro')}
                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center gap-2 ${tela === 'cadastro' ? 'bg-orange-500' : 'bg-transparent'}`}
            >
                <PlusCircle size={20} color={tela === 'cadastro' ? 'white' : '#94a3b8'} />
                {tela === 'cadastro' && <Text className="text-white font-bold text-sm">Novo</Text>}
            </TouchableOpacity>
        </View>
    );

    return (
        // Usa SafeAreaView do pacote correto
        <SafeAreaView className="flex-1 bg-orange-50" edges={['right', 'top', 'left']}>
            {renderHeader()}
            {tela === 'lista' ? renderLista() : renderForm()}
            {renderNavbar()}
        </SafeAreaView>
    );
}