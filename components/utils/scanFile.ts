import * as DocumentPicker from 'expo-document-picker';
import { Alert } from "react-native";

const apiKey = "directly put the api key here, do not use env file, it is not working in expo";

export async function scanFile(file: DocumentPicker.DocumentPickerAsset, setDetectedScamMsg: (msg: string) => void, setIsDetectedScamMsg: (value: boolean) => void, setIsLoading: (isLoading: boolean) => void) {
  try {
    // Step 1: Submit file for scanning
    const form = new FormData();
    form.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    } as any);

    const submitJobOptions = {method: 'POST', headers: {accept: 'application/json', 'x-apikey': apiKey}, body: form};

    const submitJobResponse = await fetch('https://www.virustotal.com/api/v3/files', submitJobOptions);
    const submitJobJson = await submitJobResponse.json();
    console.log(submitJobJson)

    if (!submitJobJson.data?.id) {
      Alert.alert(`Error, Invalid File: ${file.name}`);
      return null;
    }

    const jobID = submitJobJson.data.id;
    console.log("JOB ID", jobID);

    // Step 2: Fetch result using jobID
    const getAnalysisOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-apikey': apiKey
      }
    };
    setDetectedScamMsg("")
    setIsDetectedScamMsg(false)

    
    let getAnalysisJson = null
    let getAnalysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${jobID}`, getAnalysisOptions);
    Alert.alert("Submitted");
    setIsLoading(true);
    const maxRetries = 3;
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    for (let retries = 0; retries < maxRetries; retries++) {
      getAnalysisJson = await getAnalysisResponse.json();
      
      if (getAnalysisJson.data.attributes == null || getAnalysisJson.data.attributes.status != "completed") {
        await delay(10000)
        getAnalysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${jobID}`, getAnalysisOptions);
        console.log(`Retry attempt #${retries}`)
        console.log(`Status: ${getAnalysisJson.data.attributes.status}`)
        continue;
      } else {
        setIsLoading(false)
        console.log(getAnalysisJson);
        const analysisResult = getAnalysisJson.data.attributes.results
        console.log(analysisResult);
        const analysisStats = getAnalysisJson.data.attributes.stats
        const totalDetectors = Object.keys(analysisResult).length
        const maliciousCount = analysisStats.malicious
        const suspiciousCount = analysisStats.suspicious
        console.log(`Total detectors: ${totalDetectors}`)
        console.log(`Total maliciousCount: ${maliciousCount}`)
        console.log(`Total suspiciousCount: ${suspiciousCount}`)
        const ratio = (maliciousCount + suspiciousCount) / totalDetectors;
        console.log(ratio)
        let resultMsg = ""
        if (ratio >= 0.1) {
          resultMsg = `Beware! Suspicious file detected:\n${file.name}`;
        } else {
          resultMsg = `File is from a trusted source:\n${file.name}`;
          
        }
        console.log(resultMsg);
        setDetectedScamMsg(resultMsg);
        setIsDetectedScamMsg(true);
        return getAnalysisJson;
      }

    }
    console.log("Max 3 retries reached, failed to analyze file");
    setIsLoading(false);
    Alert.alert("Failed to analyze file, please try again.")
    return null;
    
  } catch (err) {
    Alert.alert("Error", err?.toString() ?? "Unknown error");
    return null;
  }
}