import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList} from '../types';

type navigationProp = NativeStackScreenProps<RootStackParamList, 'PetProfile'>;

export default function PetProfileScreen({ navigation, route }: navigationProp) {
    const existing = route.params?.pet;
    const [name, setName] = useState(existing?.name ?? '');
    const [breed, setBreed] = useState(existing?.breed ?? '');
    const [photoUri, setPhotoUri] = useState(existing?.photoUri ?? '');

    const pickPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Missing Name', "Please enter your dog's name.");
            return;
        }
        // TODO: save to Firestore
        navigation.goBack();
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

                {/* Photo picker */}
                <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Text style={styles.photoHint}>Tap to add photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Name */}
                <Text style={styles.label}>Dog's Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Buddy"
                    placeholderTextColor="#444"
                />

                {/* Breed */}
                <Text style={styles.label}>Breed (optional)</Text>
                <TextInput
                    style={styles.input}
                    value={breed}
                    onChangeText={setBreed}
                    placeholder="e.g. Golden Retriever"
                    placeholderTextColor="#444"
                />

                {/* Save */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save Dog</Text>
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
    photoPicker: { alignSelf: 'center', marginBottom: 28 },
    photo: { width: 120, height: 120, borderRadius: 60 },
    photoPlaceholder: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#141414', borderWidth: 1,
        borderColor: '#2A2A2A', borderStyle: 'dashed',
        justifyContent: 'center', alignItems: 'center', gap: 6,
    },
    photoIcon: { fontSize: 32 },
    photoHint: { color: '#555', fontSize: 11 },
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