import { Alert } from "react-native";
import { scanEmail } from "./scanEmail";
import { scanUrl } from "./scanUrl";

export async function scanText(
  input: string,
  setTrustedScannedTextMsg: (msg: string) => void,
  setScamScannedTextMsg: (msg: string) => void,
  setIsScannedText: (value: boolean) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> {
  setIsLoading(true);

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const urlRegex = /(?<![@\w.-])\b((http[s]?:\/\/|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s,;'"<>()]*)?\b/gi;

  const emails = input.match(emailRegex) || [];
  const urls = input.match(urlRegex) || [];

  if (urls.length === 0 && emails.length === 0) {
    Alert.alert("Submitted");
    setIsScannedText(true);
    setTrustedScannedTextMsg("No suspicious content detected.");
    setIsLoading(false);
    return;
  }

  let trustedUrls: string[] = [];
  let scamUrls: string[] = [];
  let trustedEmails: string[] = [];
  let scamEmails: string[] = [];

  // Scan URLs
  for (const url of urls) {
    await scanUrl(
      url,
      (msg) => {
        if (msg.startsWith("Beware!")) {
          scamUrls.push(`Suspicious URL: ${url}`);
        } else if (msg.startsWith("Link is from a trusted source:")) {
          trustedUrls.push(url);
        }
      },
      () => {},
      () => {}
    );
  }

  // Scan Emails
  for (const email of emails) {
    await scanEmail(
      email,
      (msg) => {
        if (msg.startsWith("Beware!")) {
          scamEmails.push(email);
        } else if (msg.startsWith("Email is from a trusted source:")) {
          trustedEmails.push(email);
        }
      },
      () => {},
      () => {}
    );
  }

  // Combine messages
  const finalScamMessages: string[] = [];
  const finalTrustedMessages: string[] = [];

  if (scamUrls.length > 0 || scamEmails.length > 0) {
    finalScamMessages.push(
      `Beware! The following links/emails are suspicious:\n${[
        ...scamUrls,
        ...scamEmails,
      ].join("\n")}`
    );
  }
    

  if (trustedUrls.length > 0 || trustedEmails.length > 0) {
    finalTrustedMessages.push(
      `The following links/emails are from trusted sources:\n${[
        ...trustedUrls,
        ...trustedEmails,
      ].join("\n")}`
    );
  }

  if (finalTrustedMessages.length > 0) {
    setTrustedScannedTextMsg(finalTrustedMessages.join("\n\n"));
    setIsScannedText(true);
  } 
  if (finalScamMessages.length > 0) {
    setScamScannedTextMsg(finalScamMessages.join("\n\n"));
    setIsScannedText(true);
  }

  setIsLoading(false);
}
