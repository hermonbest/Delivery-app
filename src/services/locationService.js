import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      // Direct access to store methods if needed, or emit event
      // For now we'll rely on the foreground hook for simplicity, 
      // but this file is ready for background expansion.
    }
  }
});

export const startBackgroundTracking = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') return false;

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') return false;

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 10,
    deferredUpdatesInterval: 5000,
    foregroundService: {
      notificationTitle: 'Delivery Tracking',
      notificationBody: 'Your location is being shared with customers.',
    },
  });
  return true;
};
