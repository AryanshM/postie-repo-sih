import axios from "axios";
import getAcessToken from "./getAccessToken";
export const fetchNearPost = async (
  lattitude: number,
  longitude: number,
  keyword?: String,
) => {
  const access_token = await getAcessToken();
  const url = `https://atlas.mappls.com/api/places/nearby/json`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
      params: {
        keywords: keyword,
        refLocation: `${lattitude},${longitude}`,
        radius: 5000,
        sortBy: "dist:asc",
        page: 1,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};
