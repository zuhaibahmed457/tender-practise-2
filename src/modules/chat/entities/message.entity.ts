import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Media } from 'src/modules/media/entities/media.entity';

export enum MessageStatus {
  SENT = 'sent',
  UNREAD = 'unread',
  READ = 'read',
}

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', { nullable: true })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UNREAD,
  })
  status: MessageStatus;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToMany(() => User, (user) => user.id, { cascade: true })
  @JoinTable({
    name: 'message_read_by', // Join table name
    joinColumn: { name: 'message_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  read_by: User[];
}
