import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Otp } from 'src/modules/auth/entities/otp.entity';
import { UserNotificationSetting } from 'src/modules/notifications/entities/user-notification-setting.entity';
import { UserNotification } from 'src/modules/notifications/entities/user-notification.entity';
import { Country } from 'src/modules/country/entities/country.entity';
import { CompanyType } from 'src/modules/company-type/entities/company-type.entity';
import { UserIndustries } from './user-industries.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { ReviewRating } from 'src/modules/review-rating/entities/review-rating.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
  TRANSPORTER = 'transporter',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserPaymentMethodStatus {
  NOT_PROVIDED = 'not_provided',
  PROVIDED = 'provided',
}

export enum ConnectAccountStatus {
  NOT_CONNECTED = 'not_connected',
  UNDER_REVIEW = 'under_review',
  CONNECTED = 'connected',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Media, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'profile_image_id' })
  profile_image: Media;

  @OneToOne(() => Media, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'banner_image_id' })
  banner_image: Media;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_no: string;

  @Column({ nullable: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @Column({ nullable: true })
  stripe_connect_account_id: string;

  @Column({
    type: 'enum',
    enum: ConnectAccountStatus,
    default: ConnectAccountStatus.NOT_CONNECTED,
  })
  connect_account_status: ConnectAccountStatus;

  @Column({
    type: 'enum',
    enum: UserPaymentMethodStatus,
    default: UserPaymentMethodStatus.NOT_PROVIDED,
  })
  payment_method_status: UserPaymentMethodStatus;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  time_zone: string;

  @ManyToOne(() => Country, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => CompanyType, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'company_type_id' })
  company_type: CompanyType;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: number;

  @Column({ default: 0 })
  no_of_ratings: number;

  @Column({ nullable: true })
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => LoginAttempt, (loginAttempt) => loginAttempt.user)
  login_attempts: LoginAttempt[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToOne(
    () => UserNotificationSetting,
    (userNotificationSetting) => userNotificationSetting.user,
  )
  user_notification_setting: UserNotificationSetting;

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.user,
  )
  user_notifications: UserNotification[];

  @OneToMany(() => UserIndustries, (userIndustries) => userIndustries.user)
  user_industries: UserIndustries[];

  @OneToMany(() => ReviewRating, (rating) => rating.given_by)
  given_ratings: ReviewRating[];

  @OneToMany(() => ReviewRating, (rating) => rating.given_to)
  received_ratings: ReviewRating[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(receivedPassword: string) {
    return bcrypt.compare(receivedPassword, this.password);
  }
}
