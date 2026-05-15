import {CameraView, useCameraPermissions} from "expo-camera";
import {Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import {useRef, useState} from "react";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types";
import {saveScanImage} from "../utils/saveImage";
import {saveScan} from "../utils/firestore";
import {classifyImage} from "../utils/classifier";

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export default function CameraScreen({ navigation, route }: navigationProp) {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            await handleScan(result.assets[0].uri);
        }
    };

    const handleScan = async (photoUri: string) => {
        setLoading(true);
        try {
            const scanId = `scan_${Date.now()}`;
            const localUri = await saveScanImage(photoUri, scanId);
            const result = await classifyImage(localUri, route.params.petId);
            await saveScan(result);
            navigation.navigate('Result', { result });
        } catch (err) {
            Alert.alert('Scan Failed', 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const takePhoto = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (!photo) return;
        await handleScan(photo.uri);
    };

    if (!permission?.granted) {
        return (
            <SafeAreaView style={CameraScreenStyles.container2}>
                <View style={CameraScreenStyles.container}>
                    <Text style={{ textAlign: 'center' }}> Grant access to camera </Text>
                    <TouchableOpacity onPress={requestPermission}>
                        <Text style={{ marginTop : 10, textAlign: 'center' }}>Give Access </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={CameraScreenStyles.container2}>
            <CameraView ref={cameraRef} style={CameraScreenStyles.container2} />

            {/* Back button */}
            <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom controls */}
            <View style={CameraScreenStyles.camera}>
                <TouchableOpacity onPress={pickFromGallery} disabled={loading} style={CameraScreenStyles.galleryBtn}>
                    <Text style={{ color: '#4ADE80', fontSize: 16}}>Gallery</Text>
                </TouchableOpacity>

                <View style={{ width: 50 }} />

                <TouchableOpacity onPress={takePhoto} style={CameraScreenStyles.btn} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ fontSize: 32 }}>🐾</Text>}
                </TouchableOpacity>
            </View>

            {/* Loading overlay */}
            {loading && (
                <View style={[{...StyleSheet.absoluteFillObject}, CameraScreenStyles.loadingWheel]}>
                    <ActivityIndicator color="#4ADE80" size="large" />
                    <Text style={{ color: '#4ADE80', fontSize: 16 }}>Analyzing...</Text>
                </View>
            )}
        </View>
    );
}

const CameraScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container2 : {
        flex: 1,
    },
    camera: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    btn : {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    galleryBtn: {
        width: 75,
        height: 60,
        borderRadius: 10,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingWheel : {
        backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', gap: 16
    }
});