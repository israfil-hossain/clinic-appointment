import axios from "axios";

// Utility function to fetch time slots by location, day, and optional date
export async function getTimeSlotsByLocationAndDay(filters:any) {
  try {
    const response = await axios.get("/api/schedule", {
      params: filters, 
      withCredentials: true,
    });
    console.log("Response", response)

    if (response.data) {
      return response.data.data; // Return time slots if successful
    } else {
      throw new Error(response.data.message || "Failed to fetch time slots.");
    }
  } catch (err) {
    console.error("Error fetching time slots:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

// High-level function to handle API calls
export const fetchTimeSlotsAPI = async (location:string, dayName:string, date?:string) => {
  if (!location || !dayName) {
    console.warn("Location or dayName is missing.");
    return [];
  }
  
  const filters = {
    location,
    day: dayName, // Assuming your API expects 'day' as the key
    ...(date && { date }), // Include date only if provided
  };

  try {
    return await getTimeSlotsByLocationAndDay(filters);
  } catch (error) {
    console.error("Error in fetchTimeSlotsAPI:", error);
    throw error;
  }
};
