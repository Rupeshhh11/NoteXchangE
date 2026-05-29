import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BidAttributes {
    id: string;
    taskId: string;
    serviceProviderId: string;
    amount: number;
    deliveryTime: number;
    description: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

interface BidCreationAttributes extends Optional<BidAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Bid extends Model<BidAttributes, BidCreationAttributes> implements BidAttributes {
    public id!: string;
    public taskId!: string;
    public serviceProviderId!: string;
    public amount!: number;
    public deliveryTime!: number;
    public description!: string;
    public status!: 'pending' | 'accepted' | 'rejected';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Bid.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'tasks', key: 'id' },
        },
        serviceProviderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        deliveryTime: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Delivery time in days',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
            defaultValue: 'pending',
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
        tableName: 'bids',
        timestamps: true,
    }
);

export default Bid;
