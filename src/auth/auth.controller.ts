import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { Public } from "../guards/guards";
import { UpdateRefreshTokenDto } from "./dto/auth.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication') // Groups this under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Refresh access and refresh tokens using a valid refresh token.
     *
     * @param {UpdateRefreshTokenDto} body - The DTO containing the refresh token.
     * @returns {Promise<{ access_token: string, refresh_token: string }>} The new access and refresh tokens.
     */
    @Public()
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh Access & Refresh Token' })
    @ApiResponse({
        status: 200,
        description: 'New access and refresh tokens generated successfully',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    @ApiBody({
        description: 'Provide the refresh token to get new tokens',
        schema: {
            example: {
                refreshToken: 'eyJhGcfjerwhkfheirugerjgerkjGjkfjweH9...'
            }
        }
    })
    updateRefreshToken(@Body() body: UpdateRefreshTokenDto): Promise<{ access_token: string, refresh_token: string }> {
        return this.authService.refreshTokens(body.refreshToken);
    }
}

