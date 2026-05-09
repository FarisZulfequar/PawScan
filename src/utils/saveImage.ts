import * as FileSystem from 'expo-file-system/legacy';

const BASE_DIR = `${FileSystem.documentDirectory}pawscan/`;

export async function saveScanImage(tempUri: string, scanId: string): Promise<string> {
    const dir = `${BASE_DIR}scans/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const destination = `${dir}${scanId}.jpg`;
    await FileSystem.copyAsync({ from: tempUri, to: destination });
    return destination;
}

export async function savePetImage(tempUri: string, petId: string): Promise<string> {
    const dir = `${BASE_DIR}pets/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const destination = `${dir}${petId}.jpg`;
    await FileSystem.copyAsync({ from: tempUri, to: destination });
    return destination;
}