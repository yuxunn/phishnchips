import { EMAIL_CHECKER_API_KEY } from "@env";
import { Alert } from "react-native";
const apiKey = EMAIL_CHECKER_API_KEY


export async function scanEmail(email: string, setDetectedScamMsg: (msg: string) => void, setIsDetectedScamMsg: (value: boolean) => void, setIsLoading: (isLoading: boolean) => void) {
  try {
    setIsLoading(true)
    const response = await fetch(
          `https://api.quickemailverification.com/v1/verify?email=${encodeURIComponent(email)}&apikey=${apiKey}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
    if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

    const data = await response.json();
    console.log('Verification result:', data);
    setIsDetectedScamMsg(true);
    setIsLoading(false);
    if (data.result == "invalid") {
        setDetectedScamMsg(`Beware! Suspicious email detected: ${email}`);
    } else {
        setDetectedScamMsg(`No suspicious email detected: ${email}`);
    }
    
  } catch (err) {
    setIsLoading(false);
    Alert.alert(`Error verifying email: ${email}`);
    return null;
  }
}