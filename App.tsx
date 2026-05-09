import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from "./src/screens/LoginScreen";
import PetProfileScreen from "./src/screens/PetProfileScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import CameraScreen from "./src/screens/CameraScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Auth" component={AuthScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name={'Camera'} component={CameraScreen}/>
                    <Stack.Screen name="PetProfile" component={PetProfileScreen} />
                    <Stack.Screen name={"History"} component={HistoryScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
