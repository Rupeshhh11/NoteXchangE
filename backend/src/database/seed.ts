import User from '../models/User';
import Wallet from '../models/Wallet';

export const seedDatabase = async () => {
    try {
        // Create admin user if not exists
        const adminExists = await User.findOne({ where: { email: 'admin@notexchange.com' } });

        if (!adminExists) {
            const admin = await User.create({
                email: 'admin@notexchange.com',
                password: 'Admin@123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isEmailVerified: true,
            } as any);

            await Wallet.create({
                userId: admin.id,
            });

            console.log('✅ Admin user created');
        }

        console.log('✅ Database seeded successfully');
    } catch (error) {
        console.error('Seed error:', error);
    }
};

if (require.main === module) {
    seedDatabase();
}
