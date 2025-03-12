import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallingState,
  CallContent,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { CustomCallControls } from '@/components/CustomCallControls';
import { useAuth } from '@/providers/AuthProvider';
import { PermissionsAndroid } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Page = () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const client = useStreamVideoClient();
  const { isTherapist } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
      title: `Consultation #${id}`,
    });
  }, []);

  useEffect(() => {
    const _call = client?.call('default', id as string);
    _call?.join({ create: true });

    if (_call) {
      setCall(_call);
      if (isTherapist) {
        _call.startRecording();
        _call.startTranscription();
      }
    }
  }, [client, id]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-700">Session has not started yet...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View className="flex-1">
        <CallContent
          layout="spotlight"
          onHangupCallHandler={() => {
            call?.stopRecording();
            call?.stopTranscription();
            call?.leave();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
};
export default Page;
