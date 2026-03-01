import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_PRESETS = [
  {
    id: 'quick-easy',
    name: 'Quick & Easy',
    emoji: '⚡',
    restaurants: ['Chipotle', 'Wingstop', 'Chick-fil-A', 'Subway', 'Panda Express'],
  },
  {
    id: 'date-night',
    name: 'Date Night',
    emoji: '🕯️',
    restaurants: ['Olive Garden', 'Cheesecake Factory', 'Red Lobster'],
  },
  {
    id: 'comfort-food',
    name: 'Comfort Food',
    emoji: '🍕',
    restaurants: ['Pizza Hut', "McDonald's", 'Taco Bell', 'Wendy\'s'],
  },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // Presets
      presets: DEFAULT_PRESETS,
      
      // Game state
      activePreset: null,
      gamePhase: 'idle', // idle | shuffling | choosing | revealing | aftermath
      doors: [null, null, null],
      chosenDoorIndex: null,
      revealedRestaurant: null,
      otherOptions: [],

      // Actions — Presets
      addPreset: (preset) =>
        set((state) => ({
          presets: [...state.presets, { ...preset, id: Date.now().toString() }],
        })),

      updatePreset: (id, updates) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),

      addRestaurantToPreset: (presetId, restaurant) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === presetId
              ? { ...p, restaurants: [...p.restaurants, restaurant] }
              : p
          ),
        })),

      removeRestaurantFromPreset: (presetId, restaurant) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === presetId
              ? { ...p, restaurants: p.restaurants.filter((r) => r !== restaurant) }
              : p
          ),
        })),

      // Actions — Game
      selectPreset: (presetId) => {
        const preset = get().presets.find((p) => p.id === presetId)
        if (preset) {
          set({ activePreset: preset, gamePhase: 'idle' })
        }
      },

      startGame: () => {
        const { activePreset } = get()
        if (!activePreset || activePreset.restaurants.length < 2) return

        // Shuffle and pick up to 3 restaurants (or however many exist)
        const shuffled = [...activePreset.restaurants].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, Math.min(3, shuffled.length))

        set({
          gamePhase: 'shuffling',
          doors: selected,
          chosenDoorIndex: null,
          revealedRestaurant: null,
          otherOptions: [],
        })
      },

      finishShuffle: () => {
        set({ gamePhase: 'choosing' })
      },

      chooseDoor: (index) => {
        const { doors, gamePhase } = get()
        if (gamePhase !== 'choosing' && gamePhase !== 'shuffling') return

        const revealed = doors[index]
        const others = doors.filter((_, i) => i !== index)

        set({
          gamePhase: 'revealing',
          chosenDoorIndex: index,
          revealedRestaurant: revealed,
          otherOptions: others,
        })
      },

      showAftermath: () => {
        set({ gamePhase: 'aftermath' })
      },

      resetGame: () => {
        set({
          gamePhase: 'idle',
          doors: [null, null, null],
          chosenDoorIndex: null,
          revealedRestaurant: null,
          otherOptions: [],
        })
      },

      goHome: () => {
        set({
          activePreset: null,
          gamePhase: 'idle',
          doors: [null, null, null],
          chosenDoorIndex: null,
          revealedRestaurant: null,
          otherOptions: [],
        })
      },
    }),
    {
      name: 'date-bite-storage',
      partialize: (state) => ({ presets: state.presets }),
    }
  )
)
