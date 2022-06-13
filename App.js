import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useEffect, useState } from "react";
import IconButton from "./components/ui/IconButton";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     authCtx.logout();
  //   }, 60 * 60 * 1000);
  // }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
            // same as: onPress = {() => authCtx.logout()}
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  // A function that determines the components to show depending on the auth status
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated ? <AuthStack /> : <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  // This checks if the auth token already exists before loading the app
  // putting it here makes sure it waits for the useEffect fn to run and avoids the flickering.
  const [appIsReady, setAppIsReady] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    // Async storage returns a promise so you need to wrap it in an async await or .then
    const fetchToken = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        console.log("Loading");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    fetchToken();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
      console.log("Done Loading");
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  console.log("Done Rendering");

  // return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
