import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare function validateUser(id: string, currentUser: User, updateUserDto: UpdateUserDto, user: User): void;
