import { createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthProvider';
export interface Consultation {
  id: string;
  clientId: string;
  therapistId: string;
  dateTime: string;
  status: ConsultationStatus;
  notes?: string;
}

export enum ConsultationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

interface AppointmentContextType {
  makeAppointment: (appointmentData: Omit<Consultation, 'id'>) => Promise<Consultation>;
  getAppointments: () => Promise<Consultation[]>;
  updateAppointment: (id: string, updateData: Partial<Consultation>) => Promise<Consultation>;
}

interface AppointmentProviderProps {
  children: ReactNode;
}

export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

// Create context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Provider component
export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const { authState } = useAuth();

  const makeAppointment = async (appointmentData: Omit<Consultation, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwt}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const getAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/consultations`, {
        headers: {
          Authorization: `Bearer ${authState?.jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updateData: Partial<Consultation>) => {
    try {
      const response = await fetch(`${API_URL}/consultations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwt}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const value = {
    makeAppointment,
    getAppointments,
    updateAppointment,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

// Custom hook
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
