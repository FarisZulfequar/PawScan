import React, { useState} from 'react';
import { Alert } from 'react-native';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({navigation}: navigationProp) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('')
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return missingInputAlert();
        if (!email.endsWith('@gmail.com')) return validEmailAlert();
        if (password !== rePassword) return unmatchedPasswordsAlert();

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Sign Up Failed', 'Invalid Credentials, please type a valid email, password, and re-enter password');
        } finally {
            setLoading(false);
        }
    };

    //alert functions

    const missingInputAlert = () =>
        Alert.alert('Sign Up Failed', 'Missing email or password', [
            {text: 'OK', onPress: () => null},
        ]);

    const validEmailAlert = () =>
        Alert.alert('Incorrect Email', 'Please enter a valid email', [
            {text: 'OK', onPress: () => null},
        ]);

    const unmatchedPasswordsAlert = () =>
        Alert.alert('Passwords do not match', 'Both passwords must match', [
            {text: 'OK', onPress: () => setRePassword('')},
        ]);

    const disclaimerAlert = () =>
        Alert.alert('Read First Below', 'PawScan provides AI-powered insights for informational purposes only. It is not a veterinary diagnosis. Always consult a veterinarian for health decisions.', [
            {text: 'OK', onPress: () => null},
        ]);

    return (
        <KeyboardAvoidingView
            style={AuthScreenStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={AuthScreenStyles.header}>
                <Text style={AuthScreenStyles.logo}>🐾 PawScan </Text>
                <Text style={AuthScreenStyles.tagline}>Healthy skin, happy pets. </Text>
            </View>

            <View style={AuthScreenStyles.form}>
                <Text style={AuthScreenStyles.title}>{'Create Account'}</Text>

                <TextInput
                    style={AuthScreenStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#444"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="oneTimeCode"
                />

                <TextInput
                    style={AuthScreenStyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#444"
                    secureTextEntry
                    textContentType="oneTimeCode"
                />

                <TextInput
                    style={AuthScreenStyles.input}
                    value={rePassword}
                    onChangeText={setRePassword}
                    placeholder="Re-Enter Password"
                    placeholderTextColor="#444"
                    secureTextEntry
                />

                <TouchableOpacity style={AuthScreenStyles.btn} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#0A0A0A" />
                    ) : (
                        <Text style={AuthScreenStyles.btnText}>{'Sign Up'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={AuthScreenStyles.toggle}>
                    Already have an account? Sign In
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => disclaimerAlert()}>
                <Text style={AuthScreenStyles.toggle}>
                    Disclaimer
                </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
}

export const AuthScreenStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 48 },
    logo: { fontSize: 32, fontWeight: '700', color: 'white' },
    tagline: { fontSize: 14, color: 'white', marginTop: 6 },
    form: { gap: 12, marginBottom: 24 },
    title: { fontSize: 22, fontWeight: '700', color: 'white', marginBottom: 8 },
    input: {
        backgroundColor: 'grey',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'white',
    },
    btn: {
        backgroundColor: '#4ADE80',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 4,
    },
    btnText: { color: 'black', fontWeight: '700', fontSize: 16 },
    toggle: { color: 'white', textAlign: 'center', fontSize: 14, marginBottom : 20 },
    footer: {fontSize: 10, color: '#C4B5C4', textAlign: 'center' },
});