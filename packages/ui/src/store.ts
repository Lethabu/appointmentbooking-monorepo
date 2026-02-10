import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for our state management
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Appointment {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  service_name: string;
  scheduled_time: number;
  status: string;
  payment_status: string;
}

interface DashboardStats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  activeServices: number;
}

interface AiConversation {
  id: string;
  query: string;
  response: string;
  timestamp: number;
  resolved: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  isActive: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

// Main application store
interface AppStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Dashboard state
  dashboardStats: DashboardStats | null;
  appointments: Appointment[];
  isLoadingDashboard: boolean;
  setDashboardStats: (stats: DashboardStats) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setLoadingDashboard: (loading: boolean) => void;

  // AI state
  aiConversations: AiConversation[];
  isAiTyping: boolean;
  addAiConversation: (conversation: AiConversation) => void;
  setAiTyping: (typing: boolean) => void;

  // Ecommerce state
  products: Product[];
  cart: CartItem[];
  isLoadingProducts: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
  setLoadingProducts: (loading: boolean) => void;

  // WhatsApp state
  whatsappMessages: any[];
  addWhatsappMessage: (message: any) => void;

  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Create the store with persistence and devtools
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // Auth state
        user: null,
        isAuthenticated: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),

        // Dashboard state
        dashboardStats: null,
        appointments: [],
        isLoadingDashboard: false,
        setDashboardStats: (stats) => set({ dashboardStats: stats }),
        setAppointments: (appointments) => set({ appointments }),
        setLoadingDashboard: (loading) => set({ isLoadingDashboard: loading }),

        // AI state
        aiConversations: [],
        isAiTyping: false,
        addAiConversation: (conversation) =>
          set((state) => ({
            aiConversations: [...state.aiConversations, conversation]
          })),
        setAiTyping: (typing) => set({ isAiTyping: typing }),

        // Ecommerce state
        products: [],
        cart: [],
        isLoadingProducts: false,
        addToCart: (productId, quantity = 1) =>
          set((state) => {
            const existingItem = state.cart.find(item => item.productId === productId);
            const product = state.products.find(p => p.id === productId);

            if (!product) return state;

            if (existingItem) {
              return {
                cart: state.cart.map(item =>
                  item.productId === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                )
              };
            } else {
              return {
                cart: [...state.cart, { productId, quantity, product }]
              };
            }
          }),
        removeFromCart: (productId) =>
          set((state) => ({
            cart: state.cart.filter(item => item.productId !== productId)
          })),
        clearCart: () => set({ cart: [] }),
        setProducts: (products) => set({ products }),
        setLoadingProducts: (loading) => set({ isLoadingProducts: loading }),

        // WhatsApp state
        whatsappMessages: [],
        addWhatsappMessage: (message) =>
          set((state) => ({
            whatsappMessages: [...state.whatsappMessages, message]
          })),

        // UI state
        sidebarOpen: false,
        theme: 'light',
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'appointment-booking-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          cart: state.cart,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'appointment-booking-devtools',
    }
  )
);

// Helper hooks for specific functionality
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAppStore();
  return { user, isAuthenticated, login, logout };
};

export const useDashboard = () => {
  const {
    dashboardStats,
    appointments,
    isLoadingDashboard,
    setDashboardStats,
    setAppointments,
    setLoadingDashboard,
  } = useAppStore();

  return {
    dashboardStats,
    appointments,
    isLoadingDashboard,
    setDashboardStats,
    setAppointments,
    setLoadingDashboard,
  };
};

export const useAI = () => {
  const { aiConversations, isAiTyping, addAiConversation, setAiTyping } = useAppStore();
  return { aiConversations, isAiTyping, addAiConversation, setAiTyping };
};

export const useEcommerce = () => {
  const {
    products,
    cart,
    isLoadingProducts,
    addToCart,
    removeFromCart,
    clearCart,
    setProducts,
    setLoadingProducts,
  } = useAppStore();

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return {
    products,
    cart,
    cartTotal,
    cartItemCount,
    isLoadingProducts,
    addToCart,
    removeFromCart,
    clearCart,
    setProducts,
    setLoadingProducts,
  };
};

export const useUI = () => {
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useAppStore();
  return { sidebarOpen, theme, toggleSidebar, setTheme };
};
