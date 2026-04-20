import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import { SESSION_USER_ID_KEY, sessionStore } from '@/src/stores/sessionStore';

/**
 * Читает сохранённый user_id (UUID) или создаёт новый и кладёт в AsyncStorage + MobX.
 */
export async function bootstrapSession(): Promise<void> {
  let id = await AsyncStorage.getItem(SESSION_USER_ID_KEY);
  if (id == null || id === '') {
    id = Crypto.randomUUID();
    await AsyncStorage.setItem(SESSION_USER_ID_KEY, id);
  }
  sessionStore.setUserId(id);
}
