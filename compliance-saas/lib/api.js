// Basic API structure for integration
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};
