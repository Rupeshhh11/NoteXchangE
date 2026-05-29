import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'client' | 'service_provider' | 'admin';
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdentityVerified: boolean;
    profileImage: string | null;
    bio: string | null;
    rating: number;
    ratingCount: number;
    totalEarnings: number;
    totalSpent: number;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public phoneNumber!: string;
    public role!: 'client' | 'service_provider' | 'admin';
    public isEmailVerified!: boolean;
    public isPhoneVerified!: boolean;
    public isIdentityVerified!: boolean;
    public profileImage!: string | null;
    public bio!: string | null;
    public rating!: number;
    public ratingCount!: number;
    public totalEarnings!: number;
    public totalSpent!: number;
    public isActive!: boolean;
    public lastLogin!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('client', 'service_provider', 'admin'),
            defaultValue: 'client',
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isPhoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isIdentityVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        ratingCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        totalEarnings: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        totalSpent: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
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
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        },
    }
);

export default User;
