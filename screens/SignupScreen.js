import { useContext, useState } from "react";
import { Alert } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { signUp } from "../components/util/auth";
import { AuthContext } from "../store/auth-context";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  const signUpHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const token = await signUp(email, password);
      // since createUser is an async function that'll return a promise, we need to handle the promise with an async await here
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        "Could not log you in. Please check your input and try again later."
      );
    }
    setIsAuthenticating(false);
  };

  return isAuthenticating ? (
    <LoadingOverlay message={"Creating user..."} />
  ) : (
    <AuthContent onAuthenticate={signUpHandler} />
  );
}

export default SignupScreen;
