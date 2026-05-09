// src/utils/firestore.ts
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Pet, ScanResult } from '../types';

// ─── PETS ────────────────────────────────────────────────────────────────────

export async function savePet(pet: Omit<Pet, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'pets'), pet);
    return ref.id;
}

export async function updatePet(petId: string, data: Partial<Pet>): Promise<void> {
    await updateDoc(doc(db, 'pets', petId), data);
}

export async function deletePet(petId: string): Promise<void> {
    await deleteDoc(doc(db, 'pets', petId));
}

export async function getPets(): Promise<Pet[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(collection(db, 'pets'), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pet));
}

// ─── SCANS ───────────────────────────────────────────────────────────────────

export async function saveScan(scan: ScanResult): Promise<void> {
    await addDoc(collection(db, 'scans'), scan);
}

export async function getScans(petId?: string): Promise<ScanResult[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = petId
        ? query(collection(db, 'scans'), where('petId', '==', petId), orderBy('timestamp', 'desc'))
        : query(collection(db, 'scans'), where('ownerId', '==', uid), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data() } as ScanResult));
}