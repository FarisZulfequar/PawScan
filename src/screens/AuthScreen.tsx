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

export function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.logo}>🐾 PawScan</Text>
                <Text style={styles.tagline}>TAG LINE</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome'}</Text>

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#444"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#444"
                    secureTextEntry
                />

                <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#0A0A0A" />
                    ) : (
                        <Text style={styles.btnText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Toggle */}
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggle}>
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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