import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WalletAttributes {
    id: string;
    userId: string;
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
    createdAt: Date;
    updatedAt: Date;
}

interface WalletCreationAttributes extends Optional<WalletAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
    public id!: string;
    public userId!: string;
    public balance!: number;
    public totalEarned!: number;
    public totalWithdrawn!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Wallet.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: { model: 'users', key: 'id' },
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        totalEarned: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        totalWithdrawn: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
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
        tableName: 'wallets',
        timestamps: true,
    }
);

export default Wallet;
