import { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Consultation, useAppointments } from '@/providers/AppointmentProvider';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useVideoPlayer, VideoView } from 'expo-video';

interface ConsultationInfo extends Consultation {
  recordings?: any;
  transcriptions?: any;
}

const Page = () => {
  const { isTherapist } = useAuth();
  const { getAppointments } = useAppointments();
  const [appointments, setAppointments] = useState<ConsultationInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const client = useStreamVideoClient();
  const player = useVideoPlayer(null);
  const videoRef = useRef<VideoView>(null);

  if (!isTherapist) {
    return (
      <View>
        <Text>You are not a therapist</Text>
      </View>
    );
  }

  useEffect(() => {
    loadAppointmenets();
  }, []);

  const loadAppointmenets = async () => {
    const appointments = await getAppointments();
    console.log('appointments:', appointments);
    setAppointmentInfo(appointments);
  };

  const setAppointmentInfo = async (appointments: ConsultationInfo[]) => {
    await Promise.all(
      appointments.map(async (appointment) => {
        const _call = client?.call('default', appointment.id as string);
        const recordingsQuery = await _call?.queryRecordings();
        const transcriptionQuery = await _call?.queryTranscriptions();
        appointment.recordings = recordingsQuery?.recordings;
        appointment.transcriptions = transcriptionQuery?.transcriptions;
      })
    );
    console.log('FINALLY ', appointments);
    setAppointments(appointments);
  };

  const playVideo = (url: string) => {
    console.log('playing video', url);

    player.replace(url);
    player.play();
    videoRef.current?.enterFullscreen();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        className="flex-1 bg-gray-50"
        data={appointments}
        contentContainerClassName="p-4"
        ListHeaderComponent={() => (
          <VideoView
            player={player}
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
        renderItem={({ item: appointment }) => (
          <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <View className="border-b border-gray-200 pb-2 mb-3">
              <Text className="text-lg font-semibold">{appointment.clientEmail}</Text>
              <Text className="text-gray-600">
                {new Date(appointment.dateTime).toLocaleString()}
              </Text>
            </View>

            {appointment.recordings && appointment.recordings.length > 0 ? (
              <View className="mb-3">
                <Text className="font-medium mb-2">Recordings</Text>
                {appointment.recordings.map((recording: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-50 py-2 rounded mb-2"
                    onPress={() => playVideo(recording.url)}>
                    <Text className="text-blue-600">Recording {index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 mb-3">No recordings available</Text>
            )}

            {appointment.transcriptions && appointment.transcriptions.length > 0 ? (
              <View>
                <Text className="font-medium mb-2">Transcriptions</Text>
                {appointment.transcriptions.map((transcription: any, index: number) => (
                  <View key={index} className="bg-gray-50 p-2 rounded mb-2">
                    <Text className="text-gray-700">{transcription.text}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500">No transcriptions available</Text>
            )}
          </View>
        )}
        onRefresh={loadAppointmenets}
        refreshing={refreshing}
      />
    </View>
  );
};
export default Page;
