// src/utils/classifier.ts
import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as FileSystem from 'expo-file-system';
import { ScanResult } from '../types';
import { auth } from '../lib/firebase';
import { CONDITION_INFO } from '../constants';

const CLASS_NAMES = [
    'Dermatitis',
    'Fungal_infections',
    'Healthy',
    'Hypersensitivity',
    'demodicosis',
    'ringworm',
];

export async function classifyImage(imageUri: string, petId: string): Promise<ScanResult> {
    // load model
    const model = await loadTensorflowModel(
        require('../../assets/models/pawscan_model.tflite'),
        []
    );

    // read image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as const,
    });

    // decode base64 to binary buffer
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    // run inference
    const output = await model.run([bytes.buffer]);
    const scores = new Float32Array(output[0] as ArrayBuffer);

    // map scores to predictions
    const predictions = CLASS_NAMES.map((name, i) => ({
        class: name,
        confidence: scores[i] ?? 0,
    }));

    // sort by confidence descending
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
}