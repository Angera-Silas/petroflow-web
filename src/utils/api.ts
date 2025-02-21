/* eslint-disable @typescript-eslint/no-explicit-any */

const apiRequest = async (
  endpoint: string,
  method: string,
  body?: any
) => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    // Check if the response has content before parsing as JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("API Response Data:", data); // Log the response data for debugging
      return data;
    } else {
      console.warn("Response is not JSON:", response);
      return null; // or return an empty object/array if you expect a specific structure
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getRequest = async (endpoint: string) => {
  return apiRequest(endpoint, "GET");
};

export const postRequest = async (endpoint: string, body: any) => {
  return apiRequest(endpoint, "POST", body);
};

export const putRequest = async (endpoint: string, body: any) => {
  return apiRequest(endpoint, "PUT", body);
};

export const deleteRequest = async (endpoint: string) => {
  return apiRequest(endpoint, "DELETE");
};

export const patchRequest = async (endpoint: string, body: any) => {
  return apiRequest(endpoint, "PATCH", body);
};