import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	NotFoundException,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Hospital } from './entities/hospital.entity';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalsController {
	constructor(private readonly hospitalsService: HospitalsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new hospital' })
	@ApiResponse({ status: 201, type: Hospital })
	create(@Body() createHospitalDto: CreateHospitalDto) {
		return this.hospitalsService.create(createHospitalDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all hospitals' })
	@ApiResponse({ status: 200, type: [Hospital] })
	@ApiResponse({ status: 404, description: 'No hospitals found' })
	async findAll() {
		const hospitals = await this.hospitalsService.findAll();
		if (!hospitals.length) {
			throw new NotFoundException('No hospitals found');
		}
		return hospitals;
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get hospital by ID' })
	@ApiResponse({ status: 200, type: Hospital })
	findOne(@Param('id') id: string) {
		return this.hospitalsService.findOne(+id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update hospital by ID' })
	@ApiResponse({ status: 200, type: Hospital })
	update(
		@Param('id') id: string,
		@Body() updateHospitalDto: UpdateHospitalDto
	) {
		return this.hospitalsService.update(+id, updateHospitalDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete hospital by ID' })
	@ApiResponse({ status: 204, description: 'Successfully deleted!' })
	remove(@Param('id') id: string) {
		return this.hospitalsService.remove(+id);
	}
}
