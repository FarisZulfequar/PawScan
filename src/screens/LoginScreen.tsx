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

type navigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: navigationProp) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('')
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!email || !password) {
            Alert.alert('Empty Email/Passowrd', 'Please enter a valid email and password', [
                {text: 'OK', onPress: () => null},
            ])
        }
        else if (!email.endsWith('@gmail.com')) {
            Alert.alert('Incorrect Gmail', 'Please enter a valid gmail', [
                {text: 'OK', onPress: () => null},
            ])
        }
        else {
            navigation.navigate('Home')
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