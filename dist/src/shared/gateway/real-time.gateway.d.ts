import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
export declare enum EventType {
    NOTIFICATION = "notification",
    MESSAGE = "message"
}
export declare class RealTimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private loginAttemptsRepository;
    private usersRepository;
    private readonly logger;
    constructor(loginAttemptsRepository: Repository<LoginAttempt>, usersRepository: Repository<User>);
    server: Server;
    private usersSockets;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendEventToUser(userId: string, eventType: EventType, payload: any): void;
    handleMessage(messageData: any): void;
}
