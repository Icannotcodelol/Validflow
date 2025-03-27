import { EventEmitter } from 'events';
import { connectToDatabase } from './mongodb';

// Increase the default max listeners limit to prevent warnings
EventEmitter.defaultMaxListeners = 30;

// Initialize MongoDB connection
connectToDatabase()
  .then(() => {
    console.log('MongoDB initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize MongoDB:', error);
  });

// Export the configured EventEmitter
export default EventEmitter; 