import { useAuth } from '@/providers/AuthProvider';
import {
  CallControlProps,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleCameraFaceButton,
  ReactionsButton,
  HangUpCallButton,
} from '@stream-io/video-react-native-sdk';

import { View } from 'react-native';

export const CustomCallControls = (props: CallControlProps) => {
  const { isTherapist } = useAuth();

  return (
    <View className="absolute bottom-10 py-4 w-4/5 mx-5 flex-row self-center justify-around rounded-[10px] border-5 border-blue-500 bg-blue-800 z-5">
      <ToggleMic />
      <ToggleCameraFaceButton />
      {!isTherapist && <ReactionsButton />}
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};
