import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface BlogAttributes {
    id: number;
    title: string;
    content: string;
    image_url: string;
    created_at?: Date;
}

interface BlogCreationAttributes extends Optional<BlogAttributes, 'id' | 'created_at'> { }

export class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
    public id!: number;
    public title!: string;
    public content!: string;
    public image_url!: string;
    public created_at!: Date;

    // timestamps are true by default, so we can define them as optional
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    Blog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            image_url: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'blogs',
            timestamps: false, // Set to false because you have created_at as DATE and no updated_at
            underscored: true, // Use snake_case for column names in the DB
        }
    );

    return Blog;
}; 