// "use client";

// import { useState, useEffect } from "react";
// import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// import Geocode from "react-geocode";

// const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Geocode.setApiKey(API_KEY);
// Geocode.setLanguage("en");
// Geocode.setRegion("in");
// Geocode.setLocationType("ROOFTOP");

// type Location = {
//   lat: number;
//   lng: number;
// };

// type StudentLocationMapProps = {
//   onLocationSelect: (lat: number, lng: number, address: string) => void;
//   initialLocation: Location | null;
// };

// const containerStyle = {
//   width: "100%",
//   height: "100%"
// };

// const defaultCenter = {
//   lat: 20.5937,
//   lng: 78.9629
// };

// export default function StudentLocationMap({ onLocationSelect, initialLocation }: StudentLocationMapProps) {
//   const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation);
//   const [address, setAddress] = useState("");
//   const [map, setMap] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ lat: latitude, lng: longitude });
//           setLoading(false);
//         },
//         () => {
//           setCurrentLocation(defaultCenter);
//           setLoading(false);
//         }
//       );
//     } else {
//       setCurrentLocation(defaultCenter);
//       setLoading(false);
//     }
//   }, []);

//   const handleMapClick = async (e: google.maps.MapMouseEvent) => {
//     if (!e.latLng) return;
    
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
    
//     setSelectedLocation({ lat, lng });
    
//     try {
//       const response = await Geocode.fromLatLng(lat.toString(), lng.toString());
//       const addr = response.results[0].formatted_address;
//       setAddress(addr);
//     } catch (error) {
//       console.error("Error getting address:", error);
//       setAddress("Address not found");
//     }
//   };

//   const handleConfirmLocation = () => {
//     if (selectedLocation && address) {
//       onLocationSelect(selectedLocation.lat, selectedLocation.lng, address);
//     }
//   };

//   if (loading) {
//     return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
//   }

//   return (
//     <div className="relative h-full w-full">
//       <LoadScript googleMapsApiKey={API_KEY}>
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={currentLocation || defaultCenter}
//           zoom={selectedLocation ? 15 : 5}
//           onClick={handleMapClick}
//           onLoad={(map) => setMap(map)}
//         >
//           {selectedLocation && (
//             <Marker position={selectedLocation} />
//           )}
          
//           {selectedLocation && address && (
//             <InfoWindow
//               position={selectedLocation}
//               onCloseClick={() => setSelectedLocation(null)}
//             >
//               <div>
//                 <p className="font-bold">Selected Location</p>
//                 <p>{address}</p>
//                 <button
//                   onClick={handleConfirmLocation}
//                   className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-sm"
//                 >
//                   Confirm Location
//                 </button>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type Location = {
  lat: number;
  lng: number;
};

type StudentLocationMapProps = {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation: Location | null;
};

const containerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = {
  lat: 20.5937, // Default to India coordinates
  lng: 78.9629
};

export default function StudentLocationMap({ onLocationSelect, initialLocation }: StudentLocationMapProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation);
  const [address, setAddress] = useState("");
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to get address from coordinates using Google Maps Geocoding API
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      const data = await response.json();
      return data.results[0]?.formatted_address || "Address not found";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Address not found";
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        () => {
          setCurrentLocation(defaultCenter);
          setLoading(false);
        }
      );
    } else {
      setCurrentLocation(defaultCenter);
      setLoading(false);
    }
  }, []);

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    
    try {
      const addr = await getAddressFromCoordinates(lat, lng);
      setAddress(addr);
    } catch (error) {
      console.error("Error getting address:", error);
      setAddress("Address not found");
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && address) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng, address);
    }
  };

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="relative h-full w-full">
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || defaultCenter}
          zoom={selectedLocation ? 15 : 5}
          onClick={handleMapClick}
          onLoad={(map) => setMap(map)}
        >
          {selectedLocation && (
            <Marker position={selectedLocation} />
          )}
          
          {selectedLocation && address && (
            <InfoWindow
              position={selectedLocation}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <p className="font-bold">Selected Location</p>
                <p>{address}</p>
                <button
                  onClick={handleConfirmLocation}
                  className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-sm"
                >
                  Confirm Location
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}