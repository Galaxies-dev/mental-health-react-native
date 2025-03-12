import { View, Text, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { useAppointments, ConsultationStatus } from '@/providers/AppointmentProvider';
import { Consultation } from '@/providers/AppointmentProvider';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';

const Page = () => {
  const { getAppointments, updateAppointment } = useAppointments();
  const [appointments, setAppointments] = useState<Consultation[]>([]);
  const { isTherapist } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAppointmenets();
    }, [])
  );

  const loadAppointmenets = async () => {
    const appointments = await getAppointments();
    setAppointments(appointments);
  };

  const callTherapist = () => {
    console.log('call therapist');
  };

  const confirmSession = async (id: string) => {
    const updatedAppointment = await updateAppointment(id, {
      status: ConsultationStatus.Confirmed,
    });
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: updatedAppointment.status } : appointment
      )
    );
  };

  const cancelSession = async (id: string) => {
    const updatedAppointment = await updateAppointment(id, {
      status: ConsultationStatus.Cancelled,
    });
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: updatedAppointment.status } : appointment
      )
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {!isTherapist && (
        <FlatList
          data={appointments}
          onRefresh={loadAppointmenets}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          ListHeaderComponent={() => (
            <View className="flex-row gap-4 mb-6">
              {/* Action Cards */}
              <Link href="/consultation/schedule" asChild>
                <TouchableOpacity className="flex-1 bg-blue-600 rounded-2xl p-4 items-start">
                  <MaterialIcons name="calendar-today" size={32} color="white" />
                  <Text className="text-white text-lg font-bold mt-2">Book Consultation</Text>
                  <Text className="text-white/80 text-sm mt-1">Schedule your next session</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/chats" asChild>
                <TouchableOpacity className="flex-1 bg-purple-600 rounded-2xl p-4 items-start">
                  <MaterialIcons name="chat" size={32} color="white" />
                  <Text className="text-white text-lg font-bold mt-2">Join Chats</Text>
                  <Text className="text-white/80 text-sm mt-1">Connect with support groups</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          renderItem={({ item }) => (
            <Link href={`/consultation/${item.id}`} asChild>
              <TouchableOpacity
                className={`border-l-4 pl-3 py-2 ${
                  item.status === ConsultationStatus.Confirmed
                    ? 'border-green-500'
                    : item.status === ConsultationStatus.Pending
                    ? 'border-yellow-500'
                    : item.status === ConsultationStatus.Cancelled
                    ? 'border-red-500'
                    : 'border-gray-500'
                }`}>
                <Text className="font-semibold">
                  {item.status === ConsultationStatus.Confirmed
                    ? 'Confirmed Session'
                    : item.status === ConsultationStatus.Pending
                    ? 'Pending Session'
                    : item.status === ConsultationStatus.Cancelled
                    ? 'Cancelled Session'
                    : 'Completed Session'}
                </Text>
                <Text className="text-gray-600">{new Date(item.dateTime).toLocaleString()}</Text>
                <Text className="text-gray-600">Dr. Simon Grimm</Text>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={() => (
            <View className="border-l-4 border-sky-500 pl-3 py-2">
              <Text className="font-semibold">No appointments</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="bg-orange-50 rounded-2xl p-4 mb-6 mt-4">
              <View className="flex-row items-center mb-3">
                <FontAwesome5 name="phone-alt" size={20} color="#f97316" />
                <Text className="text-lg font-bold ml-2 text-orange-500">Call Your Therapist</Text>
              </View>
              <Text className="text-gray-700">
                Need immediate support? Your therapist is just a call away during business hours.
              </Text>
              <Pressable
                className="bg-orange-500 rounded-lg py-2 px-4 mt-3 self-start"
                onPress={callTherapist}>
                <Text className="text-white font-semibold">Call Now</Text>
              </Pressable>
            </View>
          )}
          contentContainerClassName=""
        />
      )}

      {isTherapist && (
        <FlatList
          data={appointments}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onRefresh={loadAppointmenets}
          refreshing={refreshing}
          ListHeaderComponent={() => (
            <View className="mb-4">
              <Text className="text-xl font-bold">Upcoming Appointments</Text>
              <Text className="text-gray-600">Manage your scheduled sessions</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View>
                  <View className="flex-row items-center">
                    {item.status === 'Pending' && (
                      <Ionicons name="time-outline" size={24} color="#6B7280" />
                    )}
                    {item.status === 'Confirmed' && (
                      <Ionicons name="checkmark-circle-outline" size={24} color="#059669" />
                    )}
                    {item.status === 'Cancelled' && (
                      <Ionicons name="close-circle-outline" size={24} color="#DC2626" />
                    )}
                    {item.status === 'Completed' && (
                      <Ionicons name="checkmark-done-circle-outline" size={24} color="#1D4ED8" />
                    )}
                    <Text className="font-semibold text-lg ml-2">{item.status}</Text>
                  </View>
                  <Text className="text-gray-600">{new Date(item.dateTime).toLocaleString()}</Text>
                  <Text className="text-gray-700 mt-1">Client: {item.clientEmail}</Text>
                </View>
                {item.status === 'Pending' && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="bg-blue-600 px-4 py-2 rounded-lg"
                      onPress={() => confirmSession(item.id)}>
                      <Text className="text-white font-medium">Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-600 px-4 py-2 rounded-lg"
                      onPress={() => cancelSession(item.id)}>
                      <Text className="text-white font-medium">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === 'Confirmed' && (
                  <Link href={`/consultation/${item.id}`} asChild>
                    <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                      <Text className="text-white font-medium">Enter Session</Text>
                    </TouchableOpacity>
                  </Link>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="bg-gray-50 rounded-lg p-6 items-center">
              <Text className="font-semibold text-lg text-center">No upcoming appointments</Text>
              <Text className="text-gray-600 text-center mt-1">Your schedule is clear for now</Text>
            </View>
          )}
          contentContainerClassName="gap-4"
        />
      )}
    </View>
  );
};

export default Page;
