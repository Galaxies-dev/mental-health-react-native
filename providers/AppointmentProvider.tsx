/**
 * AppointmentProvider.tsx
 *
 * This provider manages appointment/consultation operations throughout the app.
 * It provides functionality for creating, retrieving, and updating appointments
 * between clients and therapists.
 */
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Platform } from 'react-native';

/**
 * Interface defining the structure of a consultation/appointment
 */
export interface Consultation {
  id: string;
  clientId: string;
  therapistId: string;
  dateTime: string;
  status: ConsultationStatus;
  notes?: string;
  clientEmail?: string;
}

/**
 * Enum defining the possible statuses of a consultation
 */
export enum ConsultationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

/**
 * Interface defining the methods available in the appointment context
 */
interface AppointmentContextType {
  makeAppointment: (appointmentData: Omit<Consultation, 'id'>) => Promise<Consultation>;
  getAppointments: () => Promise<Consultation[]>;
  updateAppointment: (id: string, updateData: Partial<Consultation>) => Promise<Consultation>;
}

/**
 * Props for the AppointmentProvider component
 */
interface AppointmentProviderProps {
  children: ReactNode;
}

export const API_URL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL,
  android: 'http://10.0.2.2:3000',
});

// Create the appointment context with undefined default value
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

/**
 * Provider component that manages appointment operations and provides
 * appointment-related methods to all child components through React Context
 */
export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const { authState } = useAuth();

  /**
   * Creates a new appointment/consultation
   * @param appointmentData - The data for the new appointment (without id)
   * @returns The created appointment with server-generated id
   */
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

  /**
   * Retrieves all appointments for the current user
   * The backend will filter appointments based on the user's role and ID
   * @returns Array of consultations for the current user
   */
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

  /**
   * Updates an existing appointment/consultation
   * @param id - The ID of the appointment to update
   * @param updateData - Partial data containing fields to update
   * @returns The updated appointment
   */
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

  // Context value to be provided to consumers
  const value = {
    makeAppointment,
    getAppointments,
    updateAppointment,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

/**
 * Custom hook to easily access the appointment context throughout the app
 * Throws an error if used outside of AppointmentProvider
 */
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
