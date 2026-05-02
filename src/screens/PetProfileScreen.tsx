export type TriageLevel = 'monitor' | 'vet_soon' | 'emergency';

export interface ScanPrediction {
    class: string;
    confidence: number;
}

export interface ScanResult {
    id: string;
    imageUri: string;
    predictions: ScanPrediction[]; // A list of predictions from the animal
    topCondition: string; // the condition that is most likely
    confidencelevel: number;
    triage: TriageLevel;
    timestamp: number;
    petId: string;
}

export interface Pet {
    id: string;
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed?: string;
    photoUri?: string;
    ownerId: string;
}

export type RootStackParamList = {
    Auth: undefined;
    Home: undefined;
    Camera: { petId: string };
    Result: { result: ScanResult };
    History: { petId?: string };
    PetProfile: { pet?: Pet };
};