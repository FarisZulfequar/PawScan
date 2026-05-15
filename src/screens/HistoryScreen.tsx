import React, {useState, useCallback} from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    Image, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ScanResult } from '../types';
import { useFocusEffect } from "@react-navigation/native";
import {deleteAllScans, deletePet, getScans} from "../utils/firestore";
import {CONDITION_INFO} from "../constants";

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation, route }: Props) {
    const [history, setHistory] = useState<ScanResult[]>([]);
    const petId = route.params?.petId;

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const scans = await getScans(petId);
                setHistory(scans);
            };
            load();
        }, [petId])
    );

    const clearHistory = () => {
        Alert.alert('Clear History', 'Delete all scan history?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    await deleteAllScans(petId);
                    setHistory([]);
                }
            },
        ]);
    };

    const handleDeletePet = (petId: string) => {
        Alert.alert('Delete Pet', 'This will delete this pet and all their scans.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    await deletePet(petId);
                    navigation.goBack();  // go back after deleting
                }
            },
        ]);
    };

    const renderItem = ({ item }: { item: ScanResult }) => {
        const info = CONDITION_INFO[item.topCondition];
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Result', { result: item })}
            >
                <Image
                    source={{uri: item.imageUri as string}}
                    style={styles.thumb}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.condition}>{info?.label ?? item.topCondition}</Text>
                    <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Scan History</Text>
                {history.length > 0 ? (
                    <TouchableOpacity onPress={clearHistory}>
                        <Text style={styles.clear}>Clear All Pet Scans</Text>
                    </TouchableOpacity>
                ) : <View style={{ width: 40 }} />}
            </View>

            {history.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>🐾</Text>
                    <Text style={styles.emptyText}>No scans yet</Text>
                    <TouchableOpacity
                        style={styles.emptyBtn}
                        onPress={() => navigation.navigate('Camera', { petId: petId ?? '' })}
                    >
                        <Text style={styles.emptyBtnText}>Scan My Pet</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}

                />
            )}
            <TouchableOpacity
                onPress={() => {
                    if (!petId) return;
                    handleDeletePet(petId);
                }}
                style={styles.footer}
            >
                <Text style={{ color: '#ff4444', fontSize: 16 }}>Delete Pet</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0A0A0A' },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: 20, paddingBottom: 12,
    },
    back: { color: '#4ADE80', fontSize: 22 },
    title: { color: '#fff', fontSize: 17, fontWeight: '700' },
    clear: { color: '#F87171', fontSize: 14 },
    card: {
        flexDirection: 'row', gap: 14,
        backgroundColor: '#141414', borderRadius: 14,
        padding: 14, marginBottom: 10, alignItems: 'center',
    },
    thumb: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#222' },
    condition: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 3 },
    triage: { fontSize: 12, marginBottom: 3 },
    date: { fontSize: 11, color: '#555' },
    arrow: { color: '#fff', fontSize: 20 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    emptyIcon: { fontSize: 48 },
    emptyText: { color: '#555', fontSize: 16 },
    emptyBtn: {
        backgroundColor: '#4ADE80', borderRadius: 12,
        paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
    },
    emptyBtnText: { color: '#0A0A0A', fontWeight: '700', fontSize: 15 },
    footer : {
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom : 20,
    }
});
