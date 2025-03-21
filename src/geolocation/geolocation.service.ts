import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import axios from "axios";

@Injectable()
export class GeolocationService {
    async getCityAndCountry(latitude: number, longitude: number): Promise<{ city: string, country: string }> {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;

            const response = await axios.get(url);
            const data = response.data;

            if (!data.address) {
                throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
            }

            return {
                city: data.address.city || data.address.town || data.address.village || "Unknown City",
                country: data.address.country || "Unknown Country"
            };
        } catch (error) {
            throw new HttpException('Error fetching location', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
