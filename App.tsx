import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthScreen from "./src/screens/AuthScreen";
import LoginScreen from "./src/screens/LoginScreen";

export default function App() {
  return (
      <SafeAreaProvider>
        <AuthScreen />
      </SafeAreaProvider>
  );
}
