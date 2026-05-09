import {ScanResult, TriageLevel} from '../types';

export const TRIAGE_CONFIG: Record<TriageLevel, { label: string; advice: string;  color: string; bg: string }> = {
    monitor: {
        label: 'Monitor at Home',
        advice:
            'Condition is mild, Keep the area clean and dry and watch for next 1-3 days and go to the vet if worsens.',
        color: '#34D399',
        bg: '#052E16',
    },
    vet_soon: {
        label: 'See a Vet Soon',
        advice:
            'Condition needs professional attention within the next 1–3 days. Avoid letting your pet scratch or lick the area.',
        color: '#FBBF24',
        bg: '#1C1400',
    },
    emergency: {
        label: 'Seek Emergency Care',
        advice:
            'Condition may be serious. Take your pet to a veterinary clinic or emergency animal hospital as soon as possible.',
        color: '#F87171',
        bg: '#2D0A0A',
    },
};

export const CONDITION_INFO: Record<
    string,
    { label: string; description: string; tip: string; triage: TriageLevel }
> = {
    fungal_infections: {
        label: 'Fungal Infection',
        description:
            'A fungal infection affecting the skin, often causing scaling, redness, and hair loss. Can spread to other pets and sometimes to humans.',
        tip: 'Keep the area clean and dry. Avoid letting your pet scratch or lick the affected area. Schedule a vet visit within 2–3 days — antifungal treatment is usually needed.',
        triage: 'vet_soon',
    },
    dermatitis: {
        label: 'Dermatitis',
        description:
            'Inflammation of the skin that can result from allergies, irritants, or infections. Commonly causes redness, itching, and flaky or weeping skin.',
        tip: 'Try to identify and remove any potential irritants (new food, detergent, plants). Prevent your pet from scratching. See a vet if symptoms persist beyond 48 hours.',
        triage: 'monitor',
    },
    demodicosis: {
        label: 'Demodicosis (Mange)',
        description:
            'A parasitic skin condition caused by Demodex mites living in the hair follicles. Causes patchy hair loss, scaling, and sometimes secondary bacterial infections.',
        tip: 'Do not attempt to treat at home with over-the-counter products. See a vet within 1–2 days — prescription treatment is required and results are best when caught early.',
        triage: 'emergency',
    },
    healthy: {
        label: 'Healthy Skin',
        description:
            'No significant skin condition detected. Your pet\'s skin and coat appear normal based on this scan.',
        tip: 'Great news! Keep up with regular grooming, a balanced diet, and routine vet check-ups to maintain your pet\'s healthy skin and coat.',
        triage: 'monitor',
    },
    hypersensitivity: {
        label: 'Hypersensitivity / Allergy',
        description:
            'An allergic reaction causing skin inflammation, hives, or intense itching. Triggers can include food ingredients, environmental allergens, flea bites, or contact irritants.',
        tip: 'Note any recent changes to food, environment, or products used on your pet. Antihistamines may help short-term, but identifying and removing the trigger is key — consult your vet.',
        triage: 'vet_soon',
    },
    ringworm: {
        label: 'Ringworm',
        description:
            'Ringworm is a highly contagious fungal infection (not a worm) that causes circular patches of hair loss with a scaly border.',
        tip: 'Ringworm can spread to other pets and humans — wash hands after handling your pet and avoid close contact until treated. See a vet promptly for antifungal medication.',
        triage: 'vet_soon',
    },
};

// Default Tests Results
export const FAKE_RESULT_MONITOR: ScanResult = {
    id: 'test-monitor',
    imageUri: require('../../assets/images/healthyskin.jpg'),
    predictions: [
        { class: 'Healthy', confidence: 0.76 },
        { class: 'Dermatitis', confidence: 0.14 },
        { class: 'Hypersensitivity', confidence: 0.07 },
        { class: 'Ringworm', confidence: 0.02 },
        { class: 'Fungal Infections', confidence: 0.01 },
        { class: 'Demodicosis', confidence: 0.01 },
    ],
    topCondition: 'healthy',
    confidencelevel: 0.76,
    triage: 'monitor',
    timestamp: Date.now(),
    petId: 'pet-001',
    class: 'Healthy',
    confidence: 0.76,
};

export const FAKE_RESULT_VET_SOON: ScanResult = {
    id: 'test-vet-soon',
    imageUri: require('../../assets/images/ringwormskin.jpg'),
    predictions: [
        { class: 'Ringworm', confidence: 0.81 },
        { class: 'Fungal Infections', confidence: 0.11 },
        { class: 'Dermatitis', confidence: 0.05 },
        { class: 'Demodicosis', confidence: 0.02 },
        { class: 'Hypersensitivity', confidence: 0.01 },
        { class: 'Healthy', confidence: 0.01 },
    ],
    topCondition: 'ringworm',
    confidencelevel: 0.81,
    triage: 'vet_soon',
    timestamp: Date.now(),
    petId: 'pet-002',
    class: 'Ringworm',
    confidence: 0.81,
};

export const FAKE_RESULT_EMERGENCY: ScanResult = {
    id: 'test-emergency',
    imageUri: require('../../assets/images/demodicosisskin.jpg'),
    predictions: [
        { class: 'Demodicosis', confidence: 0.91 },
        { class: 'Ringworm', confidence: 0.05 },
        { class: 'Fungal Infections', confidence: 0.02 },
        { class: 'Dermatitis', confidence: 0.01 },
        { class : 'Hypersensitivity', confidence : 0.01},
        { class: 'Healthy', confidence: 0.01 },
    ],
    topCondition: 'demodicosis',
    confidencelevel: 0.91,
    triage: 'emergency',
    timestamp: Date.now(),
    petId: 'pet-003',
    class: 'Demodicosis',
    confidence: 0.91,
};