// src/screens/ResultScreen.tsx
import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {
    TRIAGE_CONFIG,
    CONDITION_INFO,
} from '../constants';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types";

const { width } = Dimensions.get('window');

const TRIAGE_COLORS = {
    monitor:   '#34D399', // green
    vet_soon:  '#FBBF24', // yellow
    emergency: '#F87171', // red
};

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: navigationProp) {
    const { result } = route.params;
    const info = CONDITION_INFO[result.topCondition];
    const triage = TRIAGE_CONFIG[result.triage];
    const triageColor = TRIAGE_COLORS[result.triage];

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{uri: result.imageUri}}
                style={styles.image}
            />

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.label}>Condition</Text>
                <Text style={[styles.value, { color: triageColor }]}>{info?.label ?? result.topCondition}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Confidence</Text>
                <Text style={[styles.value, { color: triageColor }]}>{Math.round(result.confidence * 100)}%</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Triage</Text>
                <Text style={[styles.value, { color: triageColor }]}>{triage.label}</Text>
                <Text style={styles.advice}>{triage.advice}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>What to do</Text>
                <Text style={styles.advice}>{info?.tip}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>All Predictions</Text>
                {result.predictions.map((specfic_prediction) => (
                    <Text key={specfic_prediction.class} style={styles.prediction}>
                        {specfic_prediction.class}: {Math.round(specfic_prediction.confidence * 100)}%
                    </Text>
                ))}
            </View>

            <Text style={styles.footer}>PawScan uses AI to get its results/percentages and may get things wrong. Always consult a licensed veterinarian.</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B1120' },
    image: { width: width, height: 250 },
    back: { padding: 16, color: '#60A5FA', fontSize: 16 },
    section: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2D45' },
    label: { fontSize: 12, color: '#CC93E6', marginBottom: 4 },
    value: { fontSize: 18, fontWeight: 'bold' },
    advice: { fontSize: 14, color: '#fff', marginTop: 4, lineHeight: 20 },
    prediction: { fontSize: 14, color: '#fff', marginTop: 4 },
    footer: { padding: 16, fontSize: 12, color: '#C4B5C4', textAlign: 'center', marginTop: 8 },
});