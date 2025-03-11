import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function useEmailSignIn() {
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailAuth = async (email, password, isSignUp = false) => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter email & password.",
      });
      return;
    }

    try {
      if (isSignUp) {
        await signUp.create({
          emailAddress: email,
          password: password,
        });

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
      } else {
        const completeSignIn = await signIn.create({
          strategy: "password",
          identifier: email,
          password: password,
        });

        if (completeSignIn) {
          await setActive({ session: completeSignIn.createdSessionId });
          router.push("/(auth)/(drawer)/home");
        }
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.errors?.[0]?.message || "Please Try Again.",
      });
    }
  };

  const handleVerification = async () => {
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/(auth)/(drawer)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Verification failed. Please try again.",
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.errors?.[0]?.message || "Verification failed. Please try again.",
      });
    }
  };

  return { 
    handleEmailAuth, 
    pendingVerification, 
    setPendingVerification,
    verificationCode, 
    setVerificationCode, 
    handleVerification 
  };
}