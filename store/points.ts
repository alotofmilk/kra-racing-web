import { create } from 'zustand';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PointsState {
  points: number;
  isLoading: boolean;
  error: string | null;
  fetchPoints: (userId: string) => Promise<void>;
  updatePoints: (userId: string, amount: number) => Promise<void>;
}

export const usePointsStore = create<PointsState>((set) => ({
  points: 0,
  isLoading: false,
  error: null,
  
  fetchPoints: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        set({ points: userDoc.data().points || 0 });
      }
    } catch (error) {
      set({ error: '포인트를 불러오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePoints: async (userId: string, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: amount
      });
      set({ points: amount });
    } catch (error) {
      set({ error: '포인트 업데이트에 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 