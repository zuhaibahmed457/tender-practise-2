import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllTendersDto } from './dto/get-all-tenders.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ManageStatusDto } from './dto/manage-status.dto';
import { GetTendersGraphDto } from './dto/get-tenders-graph.dto';

@Controller('tender')
export class TenderController {
  constructor(private readonly tenderService: TenderService) { }

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async create(
    @CurrentUser() currentUser: User,
    @Body() createTenderDto: CreateTenderDto,
  ) {
    const tender = await this.tenderService.create(
      currentUser,
      createTenderDto,
    );

    return {
      message: 'Tender created successfully',
      details: tender,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() getAllTendersDto: GetAllTendersDto,
  ) {
    const { items, meta } = await this.tenderService.findAll(
      currentUser,
      getAllTendersDto,
    );

    return {
      message: 'Tenders fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id/bid-with-non-created-status')
  @UseGuards(AuthenticationGuard)
  async findBidWithNonCreatedStatus(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
  ) {
    const bidWithNonCreatedStatus =
      await this.tenderService.findBidWithNonCreatedStatus(
        currentUser,
        paramIdDto,
      );

    return {
      message: 'Bid with non-created status fetched successfully',
      details: bidWithNonCreatedStatus,
    };
  }

  @Patch(':id/manage-status')
  @UseGuards(AuthenticationGuard)
  async manageStatus(
    @CurrentUser() currentUser: User,
    @Body() manageStatusDto: ManageStatusDto,
    @Param() paramIdDto: ParamIdDto,
  ) {
    const tender = await this.tenderService.manageStatus(
      currentUser,
      paramIdDto,
      manageStatusDto,
    );

    return {
      message: `Tender status changed to ${manageStatusDto.tender_status}`,
      tender: tender,
    };
  }
  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findOne(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
  ): Promise<IResponse> {
    const tender = await this.tenderService.findOne(currentUser, paramIdDto);

    return {
      message: 'Tender fetched successfully',
      details: tender,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION)
  @FormDataRequest()
  async update(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
    @Body() updateTenderDto: UpdateTenderDto,
  ): Promise<IResponse> {
    const updatedTender = await this.tenderService.update(
      paramIdDto,
      currentUser,
      updateTenderDto,
    );

    return {
      message: 'Tender updated successfully',
      details: updatedTender,
    };
  }

  @Post(':tender_id/attachment')
  @FormDataRequest()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION)
  async createAttachment(
    @CurrentUser() currentUser: User,
    @Param('tender_id') tender_id: string,
    @Body() createAttachmentDto: CreateAttachmentDto,
  ): Promise<IResponse> {
    const attachment = await this.tenderService.createAttachment(
      currentUser,
      tender_id,
      createAttachmentDto,
    );

    return {
      message: 'File uploaded successfully',
      details: attachment,
    };
  }

  @Delete(':tender_id/attachment/:attachment_id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION)
  async deleteAttachment(
    @CurrentUser() currentUser: User,
    @Param('tender_id') tender_id: string,
    @Param('attachment_id') attachment_id: string,
  ) {
    await this.tenderService.deleteAttachment(
      currentUser,
      tender_id,
      attachment_id,
    );

    return {
      message: 'Tender deleted successfully',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenderService.remove(+id);
  }
}
