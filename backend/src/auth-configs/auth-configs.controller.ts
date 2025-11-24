import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthConfigsService } from './auth-configs.service';
import { CreateAuthConfigDto } from './dto/create-auth-config.dto';
import { UpdateAuthConfigDto } from './dto/update-auth-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('auth-configs')
@Controller('auth-configs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AuthConfigsController {
  constructor(private readonly authConfigsService: AuthConfigsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new authentication configuration',
    description: 'Store authentication credentials for external APIs (API Keys, OAuth2, Basic Auth).'
  })
  @ApiResponse({ status: 201, description: 'Auth config created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthConfigDto: CreateAuthConfigDto, @Request() req) {
    return this.authConfigsService.create(createAuthConfigDto, req.user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authentication configurations',
    description: 'Retrieve all authentication configurations for the current user.'
  })
  @ApiResponse({ status: 200, description: 'List of auth configs' })
  findAll(@Request() req) {
    return this.authConfigsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get authentication configuration by ID',
    description: 'Retrieve a specific authentication configuration.'
  })
  @ApiResponse({ status: 200, description: 'Auth config details' })
  @ApiResponse({ status: 404, description: 'Auth config not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the owner' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.authConfigsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update authentication configuration',
    description: 'Update credentials or settings for an authentication configuration.'
  })
  @ApiResponse({ status: 200, description: 'Auth config updated successfully' })
  @ApiResponse({ status: 404, description: 'Auth config not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the owner' })
  update(
    @Param('id') id: string,
    @Body() updateAuthConfigDto: UpdateAuthConfigDto,
    @Request() req,
  ) {
    return this.authConfigsService.update(id, updateAuthConfigDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete authentication configuration',
    description: 'Permanently delete an authentication configuration.'
  })
  @ApiResponse({ status: 204, description: 'Auth config deleted successfully' })
  @ApiResponse({ status: 404, description: 'Auth config not found' })
  @ApiResponse({ status: 403, description: 'Access denied - not the owner' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.authConfigsService.remove(id, req.user.userId);
  }
}
