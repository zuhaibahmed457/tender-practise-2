import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { GetAllChatsDto } from './dto/get-all-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly messageService: MessageService,
        private readonly events: EventEmitter2,
    ) { }

    @Post()
    @UseGuards(AuthenticationGuard, RolesGuard)
    @RolesDecorator(UserRole.ORGANIZATION, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @FormDataRequest()
    async createBid(@Body() createChatDto: CreateChatDto, @CurrentUser() CurrentUser: User): Promise<IResponse> {
        const chat = await this.chatService.create(createChatDto, CurrentUser)
        return {
            message: 'Chat created successfully',
            details: chat
        };
    }

    @Get('messages')
    async getAllMessage(@Query() any, @CurrentUser() currentUser: User): Promise<IResponse> {
        const { items, meta } = await this.messageService.getAllMessage(any, currentUser)
        return {
            message: `Messages fetched successfully`,
            details: items,
            extra: meta
        }
    }

    @Get("/bid/:id")
    @UseGuards(AuthenticationGuard, RolesGuard)
    @RolesDecorator(UserRole.ORGANIZATION, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async findByBidId(@Param() paramIdDto: ParamIdDto, @CurrentUser() CurrentUser: User): Promise<IResponse> {
        const chat = await this.chatService.findByBidId(CurrentUser, paramIdDto);
        return {
            message: 'Chat found successfully',
            details: chat
        }
    }
    
    @Get(":id")
    @UseGuards(AuthenticationGuard, RolesGuard)
    @RolesDecorator(UserRole.ORGANIZATION, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async findOne(@Param() paramIdDto: ParamIdDto, @CurrentUser() CurrentUser: User): Promise<IResponse> {
        const chat = await this.chatService.findOne(CurrentUser, paramIdDto);
        return {
            message: 'Chat found successfully',
            details: chat
        }
    }

    @Get()
    @UseGuards(AuthenticationGuard, RolesGuard)
    @RolesDecorator(UserRole.ORGANIZATION, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async findAll(@Query() getAllChatsDto: GetAllChatsDto, @CurrentUser() CurrentUser: User): Promise<IResponse> {
        const chats = await this.chatService.findAll(CurrentUser, getAllChatsDto);
        return {
            message: 'Chats found successfully',
            details: chats,
        }
    }


    @Post('send-message')
    @HttpCode(200)
    @UseGuards(AuthenticationGuard)
    @FormDataRequest()
    async sendMessage(@Body() createMessageData: CreateMessageDto, @CurrentUser() currentUser: User) {
        const message = await this.messageService.createMessage(createMessageData, currentUser);

        return {
            message: 'Message send successfully',
            details: message,
        };
    }

    @Patch(":id/mark-all-message-read")
    @UseGuards(AuthenticationGuard)
    async markAllMessageRead(@Param() paramIdDto: ParamIdDto, @CurrentUser() currentUser: User): Promise<IResponse> {
        await this.messageService.markAllMessageRead(paramIdDto, currentUser);
        return {
            message: 'All message marked as read successfully',
        }
    }

}
