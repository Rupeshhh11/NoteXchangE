import sequelize from '../config/database';

export const runMigrations = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    runMigrations();
}
