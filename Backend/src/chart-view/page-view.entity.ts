import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'page_views' })
export class PageView {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', default: '/' })
  path: string;

  @Column({ type: 'text', nullable: true })
  ip?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @Column({ type: 'text', nullable: true })
  session_id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
