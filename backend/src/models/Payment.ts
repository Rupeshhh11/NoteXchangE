import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentAttributes {
    id: string;
    taskId: string;
    clientId: string;
    serviceProviderId: string;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: string;
    public taskId!: string;
    public clientId!: string;
    public serviceProviderId!: string;
    public amount!: number;
    public razorpayOrderId!: string;
    public razorpayPaymentId!: string | null;
    public razorpaySignature!: string | null;
    public status!: 'pending' | 'completed' | 'failed' | 'refunded';
    public paymentMethod!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Payment.init(
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
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
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
        razorpayOrderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        razorpayPaymentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        razorpaySignature: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: DataTypes.STRING,
            defaultValue: 'razorpay',
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
        tableName: 'payments',
        timestamps: true,
    }
);

export default Payment;
