import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: Number;

    @ManyToOne(type => Categories)
    @Column("int", { default: null })
    parent_id: Number;

    @Column({ default: null, unique: true })
    slug: String;

    @Column()
    name: String;

    @Column("text")
    description: String;

    @Column("int")
    created_at: Number;

    @Column("int")
    updated_at: Number;
}