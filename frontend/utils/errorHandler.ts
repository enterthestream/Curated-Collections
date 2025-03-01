import axios from "axios";

export function handleAxiosError(
  error: unknown,
  apiName: "MET" | "VA" | "default"
) {
  if (axios.isAxiosError(error)) {
    const apiMessage = {
      MET: "The Met Museum of Art API request failed",
      VA: "V&A Museum API request failed",
      default: "API request failed",
    };

    const errMessage = apiMessage[apiName] || apiMessage.default;

    if (error.response) {
      switch (error.response.status) {
        case 500:
          return new Error(`${errMessage}`);
      }
    }
  }
}
