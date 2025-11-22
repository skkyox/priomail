import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  subscription_status: string;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  ai_category: string;
  ai_urgency_score: number;
  ai_summary: string;
  received_at: string;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  emails: Email[];
  setEmails: (emails: Email[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  emails: [],
  setEmails: (emails) => set({ emails }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
