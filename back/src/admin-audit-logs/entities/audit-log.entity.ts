import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column()
  action: string;

  @Column({ name: 'entity_name' })
  entityName: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId: number;

  @Column({ type: 'text', nullable: true })
  payload: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
