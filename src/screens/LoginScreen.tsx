import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator, Alert,
} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types";
import {AuthScreenStyles} from "./AuthScreen";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: navigationProp) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('')
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            return Alert.alert('Empty Email/Password', 'Please enter a valid email and password');
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert('Sign In Failed', 'Invalid Credentials, please check your email and password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={AuthScreenStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={AuthScreenStyles.header}>
                <Text style={AuthScreenStyles.logo}>🐾 PawScan</Text>
                <Text style={AuthScreenStyles.tagline}>Healthy skin, happy pets.</Text>
            </View>

            <View style={AuthScreenStyles.form}>
                <Text style={AuthScreenStyles.title}>{'Welcome'}</Text>

                <TextInput
                    style={AuthScreenStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#444"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={AuthScreenStyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#444"
                    secureTextEntry
                />

                <TouchableOpacity style={AuthScreenStyles.btn} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#0A0A0A" />
                    ) : (
                        <Text style={AuthScreenStyles.btnText}>{'Sign In'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                <Text style={AuthScreenStyles.toggle}>
                    {"Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
}