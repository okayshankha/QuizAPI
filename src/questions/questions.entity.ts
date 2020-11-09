import { Categories } from 'src/categories/categories.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Questions {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ unique: true })
    hash: String;

    @Column("text")
    question: String;

    @Column("text")
    options: String;

    @Column("text")
    correct_option: String;

    @Column("text")
    explaination: String;

    @ManyToOne(type => Categories)
    @Column("int")
    category_id: Number;

    @Column("boolean", { default: true })
    is_active: boolean;

    @Column("int")
    created_at: Number;

    @Column("int")
    updated_at: Number;
}