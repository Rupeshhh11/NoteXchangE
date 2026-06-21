import User from './User';
import Task from './Task';
import Bid from './Bid';
import Message from './Message';
import Review from './Review';
import Wallet from './Wallet';

// Wallet Associations
User.hasOne(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

// Task Associations
User.hasMany(Task, { foreignKey: 'clientId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

// Bid Associations
Task.hasMany(Bid, { foreignKey: 'taskId', as: 'bids' });
Bid.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Bid, { foreignKey: 'serviceProviderId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'serviceProviderId' });

// Message Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

// Review Associations
User.hasMany(Review, { foreignKey: 'toUserId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'toUserId' });

User.hasMany(Review, { foreignKey: 'fromUserId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'fromUserId', as: 'reviewer' });

Task.hasMany(Review, { foreignKey: 'taskId', as: 'reviews' });
Review.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

export { User, Task, Bid, Message, Review, Wallet };
