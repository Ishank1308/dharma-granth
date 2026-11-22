/**
 * App entry. Expo Router's entry plus the headless task that draws the Android home-screen widget,
 * which has to be registered before Android asks for it, even when no screen is open.
 */
import 'expo-router/entry';

import { Platform } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from '@/widget/task-handler';

if (Platform.OS === 'android') registerWidgetTaskHandler(widgetTaskHandler);
