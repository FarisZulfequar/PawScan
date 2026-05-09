import {View, Text, TouchableOpacity, FlatList, Image, ScrollView, StyleSheet} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import {Pet, RootStackParamList, ScanResult} from "../types";
import {useCallback, useState} from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CONDITION_INFO } from '../constants';
import {useFocusEffect} from "@react-navigation/native";
import {getPets, getScans} from "../utils/firestore";

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen({ navigation }: navigationProp) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [recentScans, setRecentScans] = useState<ScanResult[]>([]);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const fetchedPets = await getPets();
                const fetchedScans = await getScans();
                setPets(fetchedPets);
                setRecentScans(fetchedScans.slice(0, 3));
            };
            load();
        }, [])
    );

    const handleLogout = async () => {
        await signOut(auth);
        navigation.replace('Auth');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.container2}>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>🐾 PawScan</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={{ color: '#F87171', fontSize: 14 }}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.dogText}>My Dogs</Text>
                <FlatList
                    data={pets}
                    horizontal
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PetProfile', { pet: item })}
                            style={{ alignItems: 'center', gap: 6 }}
                        >
                            {item.photoUri ? (
                                <Image source={{ uri: item.photoUri }} style={{ height: 70, width: 70, borderRadius: 35 }} />
                            ) : (
                                <View style={styles.imagecontainer}>
                                    <Text style={{ fontSize: 30, color: '#fff' }}>+</Text>
                                </View>
                            )}
                            <Text style={{ color: '#fff', fontSize: 12 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PetProfile', {})}
                            style={styles.addBtn}
                        >
                            <Text style={{ color: '#4ADE80', fontSize: 28 }}>+</Text>
                        </TouchableOpacity>
                    }
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('Camera', { petId: pets[0]?.id ?? '' })}
                    style={styles.scanBtn}
                >
                    <Text style={{ color: '#0A0A0A', fontSize: 20, fontWeight: '700', marginTop: 6 }}>Scan My Dog</Text>
                    <Text style={{ color: '#1a3d1a', fontSize: 13, marginTop: 4 }}>Take or upload a photo</Text>
                </TouchableOpacity>

                <View style={[styles.container2, { paddingHorizontal: 16, paddingVertical: 16 }]}>
                    <Text style={{ color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                        Recent Scans
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History', {})}>
                        <Text style={{ color: '#4ADE80', fontSize: 13 }}>View All →</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={recentScans}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        const info = CONDITION_INFO[item.topCondition];
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Result', { result: item })}
                                style={styles.resultBtn}
                            >
                                <Image
                                    source={typeof item.imageUri === 'number' ? item.imageUri : { uri: item.imageUri }}
                                    style={{ height: 60, width: 60, borderRadius: 10, backgroundColor: '#222' }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 3 }}>
                                        {info?.label ?? item.topCondition}
                                    </Text>
                                    <Text style={{ color: '#555', fontSize: 11 }}>
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text style={{ color: '#444', fontSize: 20 }}>›</Text>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', padding: 32, gap: 8 }}>
                            <Text style={{ color: '#fff', fontSize: 14 }}>No scans yet</Text>
                        </View>
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#0A0A0A'},
    container2: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16},
    dogText: {color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 16, marginBottom: 10},
    imagecontainer : {height: 70, width: 70, borderRadius: 35, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center'},
    addBtn: {
        height: 70, width: 70, borderRadius: 35, backgroundColor: '#141414', borderWidth: 1, borderColor: '#2A2A2A', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginLeft: 12
    },
    resultBtn: { flexDirection: 'row', gap: 12, backgroundColor: '#141414', borderRadius: 14, padding: 12, marginHorizontal: 16, marginBottom: 10, alignItems: 'center'},
    scanBtn: {backgroundColor: '#4ADE80', borderRadius: 20, margin: 16, padding: 24, alignItems: 'center'}
})