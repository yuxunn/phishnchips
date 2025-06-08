import { scanUrl } from "@/components/utils/scanUrl";
import { Alert } from "react-native";

// Add async keyword
export async function scanText(
  input: string,
  setDetectedScamMsg: (msg: string) => void,
  setIsDetectedScamMsg: (value: boolean) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> {
  Alert.alert("Submitted");
  setIsLoading(true);

  // Regex for email and URL
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const urlRegex = /\b((http[s]?:\/\/|www\.)[^\s,;'"<>()]+)\b/gi;

  const emails = input.match(emailRegex) || [];
  const urls = input.match(urlRegex) || [];

  // No URLs
  if (urls.length === 0) {
    let summary: string;
    if (emails.length === 0) {
      summary = "No suspicious content detected.";
      setIsDetectedScamMsg(true);
    } else {
      summary = `Emails: ${emails.join(", ")}`;
      setIsDetectedScamMsg(true);
    }
    setDetectedScamMsg(summary);
    setIsLoading(false);
    return;
  }

  // If URLs are found, scan the first URL
  await scanUrl(
    urls[0]!, // Scan the first detected URL (non-null assertion)
    setDetectedScamMsg,
    setIsDetectedScamMsg,
    setIsLoading
  );
}
