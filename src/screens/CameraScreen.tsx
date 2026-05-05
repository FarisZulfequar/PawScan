import {CameraView, useCameraPermissions} from "expo-camera";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {useRef} from "react";


export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const takePhoto = async () => {
        if (!cameraRef.current) return;
        const photo = await cameraRef.current.takePictureAsync();
        console.log(photo);
    };

    // If permission to access wasn't granted
    if (!permission?.granted) {
        return (
            <SafeAreaView style={CameraScreenStyles.container2}>
                <View style={CameraScreenStyles.container}>
                    <Text style={{ textAlign: "center" }} numberOfLines={2}> Grant access to camera </Text>
                    <TouchableOpacity onPress={requestPermission} >
                        <Text style={{ textAlign: "center" }} >Give Access</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={CameraScreenStyles.container2}>
            <CameraView ref={cameraRef} style={CameraScreenStyles.container2} />
            <View style={CameraScreenStyles.camera}>
                <TouchableOpacity onPress={takePhoto} style={CameraScreenStyles.btn}>
                    <Text>🐾</Text>
                </TouchableOpacity>
            </View>
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
    camera : {
        position: "absolute",
        bottom: 50,
        width: "100%",
        alignItems: "center",
    },
    btn : {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
});