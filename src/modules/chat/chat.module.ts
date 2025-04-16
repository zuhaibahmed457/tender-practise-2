import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Bid } from '../bid/entities/bid.entity';
import { Tender } from '../tender/entities/tender.entity';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from './entities/chat-participant.entity';
import { ChatController } from './chat.controller';
import { MessageService } from './message.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Bid, Tender, Message, Chat, ChatParticipant
    ]),
    MediaModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule { }
