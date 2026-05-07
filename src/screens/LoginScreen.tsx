import React, { useState } from 'react';
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

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = () => {
        if (!email || !password) {
            console.log('sign in/up failed')
        }
        if (!email.endsWith('@gmail.com')) {
            console.log('please enter a valid email address')
        }
        else {
            console.log(`\nEmail: ${email}\nPassword : ${password}`);
        }
    };

    return (
        <KeyboardAvoidingView
            style={LoginScreenStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={LoginScreenStyles.header}>
                <Text style={LoginScreenStyles.logo}>🐾 PawScan</Text>
                <Text style={LoginScreenStyles.tagline}>TAG LINE</Text>
            </View>

            <View style={LoginScreenStyles.form}>
                <Text style={LoginScreenStyles.title}>{'Welcome'}</Text>

                <TextInput
                    style={LoginScreenStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#444"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={LoginScreenStyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#444"
                    secureTextEntry
                />

                <TouchableOpacity style={LoginScreenStyles.btn} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#0A0A0A" />
                    ) : (
                        <Text style={LoginScreenStyles.btnText}>{'Sign In'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={LoginScreenStyles.toggle}>
                    {"Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
}

const LoginScreenStyles = StyleSheet.create({
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
    toggle: { color: 'white', textAlign: 'center', fontSize: 14 },
});