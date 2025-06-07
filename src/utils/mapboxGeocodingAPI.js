

// Real Mapbox Geocoding API
const mapboxGeocodingAPI = {
    search: async (query) => {
       const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      
      if (!MAPBOX_ACCESS_TOKEN) {
        console.error('Mapbox access token not found. Please add REACT_APP_MAPBOX_ACCESS_TOKEN to your .env file');
        // Fallback to mock data in development
        return mockFallback(query);
      }
  
      if (!query || query.length < 2) return [];
  
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          new URLSearchParams({
            access_token: MAPBOX_ACCESS_TOKEN,
            autocomplete: 'true',
            limit: '5',
            types: 'address',
            country: 'US', // Restrict to US only
            language: 'en'
          })
        );
  
        if (!response.ok) {
          throw new Error(`Mapbox API error: ${response.status}`);
        }
  
        const data = await response.json();
        
        return data.features.map(feature => ({
          id: feature.id,
          place_name: feature.place_name,
          text: feature.text,
          properties: {
            address: feature.place_name.split(',')[0], // Extract street address
            locality: feature.context?.find(c => c.id.includes('place'))?.text || '',
            region: feature.context?.find(c => c.id.includes('region'))?.text || '',
            postcode: feature.context?.find(c => c.id.includes('postcode'))?.text || '',
            country: feature.context?.find(c => c.id.includes('country'))?.text || ''
          },
          geometry: feature.geometry
        }));
      } catch (error) {
        console.error('Mapbox geocoding failed:', error);
        // Fallback to mock data on error
        return mockFallback(query);
      }
    }
  };
  
  export default mapboxGeocodingAPI;