import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';
import { auth } from '../lib/firebase';
import { ScanResult } from '../types';
import { CONDITION_INFO } from '../constants';

const CLASS_NAMES = [
    'Dermatitis',
    'Fungal Infection',
    'Healthy',
    'Hypersensitivity',
    'Demodicosis',
    'Ringworm',
];

export async function classifyImage(imageUri: string, petId: string): Promise<ScanResult> {
    try {
        const model = await loadTensorflowModel(
            require('../../assets/models/pawscan_model.tflite'),
            []
        );
        const resized = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 224, height: 224 } }],
            { base64: true, format: ImageManipulator.SaveFormat.JPEG }
        );
        const base64 = resized.base64!;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        // Decode JPEG into real RGBA pixels
        const decoded = jpeg.decode(bytes, { useTArray: true });
        const { data } = decoded; // RGBA, 4 bytes per pixel

        const NUM_PIXELS = 224 * 224 * 3;
        const float32 = new Float32Array(NUM_PIXELS);

        for (let i = 0; i < 224 * 224; i++) {
            float32[i * 3] = data[i * 4] / 255.0; // R
            float32[i * 3 + 1] = data[i * 4 + 1] / 255.0; // G
            float32[i * 3 + 2] = data[i * 4 + 2] / 255.0; // B
        }
        const output = await model.run([float32.buffer]);
        const scores = new Float32Array(output[0] as ArrayBuffer);

        const predictions = CLASS_NAMES.map((name, i) => ({
            class: name,
            confidence: scores[i] ?? 0,
        }));

        const sorted = [...predictions].sort((a, b) => b.confidence - a.confidence);
        const top = sorted[0];

        const conditionKey = top.class.toLowerCase().replace(/\s+/g, '_');
        const triage = CONDITION_INFO[conditionKey]?.triage ?? 'vet_soon';
        const scanId = `scan_${Date.now()}`;

        return {
            id: scanId,
            imageUri,
            predictions: sorted,
            topCondition: conditionKey,
            confidence: top.confidence,
            triage,
            timestamp: Date.now(),
            petId,
            ownerId: auth.currentUser?.uid ?? '',
        };

    } catch (e) {
        console.error('CLASSIFIER ERROR:', e);
        throw e;
    }
}