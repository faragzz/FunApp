import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {GeoDetailsResponse} from "./type";

@Injectable()
export class GeolocationService {
    /**
     * Retrieves the city and country based on latitude and longitude coordinates.
     *
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @returns {Promise<GeoDetailsResponse>} An object containing the city and country name.
     * @throws {Error} If the request to the geolocation API fails.
     */
    async getCityAndCountry(latitude: number, longitude: number): Promise<GeoDetailsResponse> {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;

            const response = await axios.get(url);
            const data = response.data;

            return {
                city: data.address?.city || data.address?.town || data.address?.village || "Unknown City",
                country: data.address?.country || "Unknown Country"
            };
        } catch (error) {
            return {city: "Unknown City", country: "Unknown Country"};
        }
    }
}
