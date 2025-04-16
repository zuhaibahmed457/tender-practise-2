import { Message } from 'src/modules/chat/entities/message.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column()
  url: string;

  @ManyToOne(() => Tender, (tender) => tender.medias, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'message_id' })
  messages: Message;

  @CreateDateColumn()
  created_at: Date;
}
