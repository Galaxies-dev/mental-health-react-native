import { View, Text, Pressable, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAppointments } from '@/providers/AppointmentProvider';
import { Consultation } from '@/providers/AppointmentProvider';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';

const Page = () => {
  const { getAppointments } = useAppointments();
  const [appointments, setAppointments] = useState<Consultation[]>([]);
  const { isTherapist } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointmenets();
  }, []);

  const loadAppointmenets = async () => {
    const appointments = await getAppointments();
    console.log(appointments);
    setAppointments(appointments);
  };

  const callTherapist = () => {
    console.log('call therapist');
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {!isTherapist && (
        <FlatList
          data={appointments}
          onRefresh={loadAppointmenets}
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
              <TouchableOpacity className="border-l-4 border-green-500 pl-3 py-2">
                <Text className="font-semibold">Next Session</Text>
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
                  <Text className="font-semibold text-lg">{item.status}</Text>
                  <Text className="text-gray-600">{new Date(item.dateTime).toLocaleString()}</Text>
                  <Text className="text-gray-700 mt-1">Client: {item.clientEmail}</Text>
                </View>
                <Link href={`/consultation/${item.id}`} asChild>
                  <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">Enter Session</Text>
                  </TouchableOpacity>
                </Link>
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
