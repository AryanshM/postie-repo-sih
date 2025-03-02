import axios from "axios";

const getAcessToken = async () => {
  const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
  const CLIENT_SECRET = process.env.EXPO_PUBLIC_CLIENT_SECRET;
  try {
    const response = await axios.post(
      "https://outpost.mapmyindia.com/api/security/oauth/token",
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    if (response.status !== 200) {
      console.log("Error in fetching access token");
    }

    return response.data.access_token;
  } catch (error) {
    console.error("Error in fetching access token", error);
    throw new Error("Error in fetching access token");
  }
};

export default getAcessToken;
