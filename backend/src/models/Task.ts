import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TaskAttributes {
    id: string;
    clientId: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    budget: number;
    budgetType: 'fixed' | 'hourly';
    deadline: Date;
    files: string[];
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    acceptedBidId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public clientId!: string;
    public title!: string;
    public description!: string;
    public category!: string;
    public subcategory!: string;
    public budget!: number;
    public budgetType!: 'fixed' | 'hourly';
    public deadline!: Date;
    public files!: string[];
    public status!: 'open' | 'in_progress' | 'completed' | 'cancelled';
    public acceptedBidId!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subcategory: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        budget: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        budgetType: {
            type: DataTypes.ENUM('fixed', 'hourly'),
            defaultValue: 'fixed',
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        files: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        status: {
            type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'),
            defaultValue: 'open',
        },
        acceptedBidId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true,
    }
);

export default Task;
