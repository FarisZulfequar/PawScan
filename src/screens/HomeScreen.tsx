import {View, Text, TouchableOpacity, FlatList, Image} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import {Pet, ScanResult} from "../types";
import {useState} from "react";

export default function HomeScreen() {
    const [pets, setPets] = useState<Pet[]>([
        { id: '1', name: 'Buddy', species: 'dog', ownerId: '1' },
    ]);
    const [recentScans, setRecentScans] = useState<ScanResult[]>([]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                <Text>PawScan</Text>
                <TouchableOpacity>
                    <Text>Log Out</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={pets}
                horizontal={true}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                        <View style={{ padding: 16 }}>
                            <Text>
                                Name: {item.name}
                            </Text>
                            {item.photoUri ? (
                                <Image source={{ uri: item.photoUri }} style={{ height: 100, width: 100 }} />
                            ) : (
                                <Text style={{ fontSize: 40 }}>🐾</Text>
                            )}
                        </View>
                )}
                ListEmptyComponent={<Text>No pets yet</Text>}
            />

            <TouchableOpacity>
                <Text>Add New Pet</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>Scan My Pet </Text>
            </TouchableOpacity>

            <Text>Recent Scan</Text>
            <FlatList
                data={recentScans}
                horizontal={true}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 16 }}>
                        <Image source={{uri : item.imageUri}} style={{height : 100, width : 100}}/>
                        <Text>Likely Condition: {item.topCondition}</Text>
                        <Text>Triage Level: {item.triage}</Text>
                        <Text>Timestamp: {new Date(item.timestamp).toLocaleDateString()}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No Recent Scans yet</Text>}
            />

        </SafeAreaView>
    );
}