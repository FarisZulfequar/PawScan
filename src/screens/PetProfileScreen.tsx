import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { savePet, updatePet } from '../utils/firestore';
import { auth } from '../lib/firebase';
type navigationProp = NativeStackScreenProps<RootStackParamList, 'PetProfile'>;

export default function PetProfileScreen({ navigation, route }: navigationProp) {
    const existing = route.params?.pet;
    const [name, setName] = useState(existing?.name ?? '');
    const [breed, setBreed] = useState(existing?.breed ?? '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Name', "Please enter your dog's name.");
            return;
        }
        setLoading(true);
        try {
            const petData = {
                name,
                species: 'dog' as const,
                breed,
                photoUri: '',
                ownerId: auth.currentUser?.uid ?? '',
            };

            if (existing) {
                await updatePet(existing.id, petData);
            } else {
                await savePet(petData);
            }
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Could not save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{existing ? 'Edit Dog' : 'Add Dog'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.label}>Dog's Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Buddy"
                    placeholderTextColor="#444"
                />

                <Text style={styles.label}>Breed (optional)</Text>
                <TextInput
                    style={styles.input}
                    value={breed}
                    onChangeText={setBreed}
                    placeholder="e.g. Golden Retriever"
                    placeholderTextColor="#444"
                />

                <TouchableOpacity
                    style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#0A0A0A" />
                        : <Text style={styles.saveBtnText}>Save Dog</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
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
    scroll: { padding: 20, paddingBottom: 40 },
    label: { color: '#888', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    input: {
        backgroundColor: '#141414', borderRadius: 12,
        padding: 16, color: '#fff', fontSize: 15,
        borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 20,
    },
    saveBtn: {
        backgroundColor: '#4ADE80', borderRadius: 12,
        padding: 16, alignItems: 'center', marginTop: 8,
    },
    saveBtnText: { color: '#0A0A0A', fontWeight: '700', fontSize: 16 },
});