import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ChatParticipant } from './chat-participant.entity';
import { Message } from './message.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'text', nullable: true })
  group_name?: string;

  @Column({ type: 'text', nullable: true })
  group_icon?: string;

  @Column({ type: 'boolean', default: false })
  is_archived: Boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.chat)
  participants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  messages: Message[];

  @CreateDateColumn()
  created_at: number;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message_sent_id' })
  last_message_sent: Message;

  @UpdateDateColumn()
  last_message_sent_at: Date;

  @OneToOne(() => Bid)
  @JoinColumn({ name: 'bid_id' })
  bid: Bid;

  @ManyToOne(() => Tender, { nullable: true })
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  archived_at: Date;
}
