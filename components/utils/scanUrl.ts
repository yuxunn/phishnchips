import { VIRUSTOTAL_API_KEY } from "@env";
import { Alert } from "react-native";
const apiKey = VIRUSTOTAL_API_KEY


export async function scanUrl(url: string, setDetectedScamMsg: (msg: string) => void, setIsDetectedScamMsg: (value: boolean) => void, setIsLoading: (isLoading: boolean) => void) {
  try {
    // Step 1: Submit URL for scanning
    const submitJobOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'x-apikey': apiKey
      },
      body: new URLSearchParams({ url }).toString(),
    };

    const submitJobResponse = await fetch('https://www.virustotal.com/api/v3/urls', submitJobOptions);
    const submitJobJson = await submitJobResponse.json();
    console.log(submitJobJson)

    if (!submitJobJson.data?.id) {
      Alert.alert(`Error, Invalid URL/domain: ${url}`);
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

    let url_id = btoa(url);
    url_id = url_id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
          resultMsg = `Beware! Suspicious URL detected:\n${url}`;
        } else {
          resultMsg = `Link is from a trusted source:\n${url}`;
          
        }
        console.log(resultMsg);
        setDetectedScamMsg(resultMsg);
        setIsDetectedScamMsg(true);
        return getAnalysisJson;
      }

    }
    console.log("Max 3 retries reached, failed to analyze URL");
    setIsLoading(false);
    Alert.alert("Failed to analyze URL, please try again.")
    return null;
    // const getUrlInfo = await fetch(`https://www.virustotal.com/api/v3/urls/${url_id}`, getAnalysisOptions);
    
  } catch (err) {
    Alert.alert("Error", err?.toString() ?? "Unknown error");
    return null;
  }
}