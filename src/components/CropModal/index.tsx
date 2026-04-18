import { View, Text, Pressable } from "react-native";
import { useVideoStore } from "@/store/videoStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

import { Modal } from "react-native";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export const CropModal = () => {
  const { isModalOpen, closeModal, step, setStep } = useVideoStore();

  const translateY = useSharedValue(0);

  const handleClose = () => {
    translateY.value = withSpring(0);
    closeModal();
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY([10, 999])
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 150 || e.velocityY > 600) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      visible={isModalOpen}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>


        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}
          onPress={handleClose}
        >

          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                {
                  height: "92%",
                  backgroundColor: "#0d0d12",
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.05)",
                },
                animatedStyle,
              ]}
            >
              <Pressable onPress={(e) => e.stopPropagation()} style={{ flex: 1 }}>

                {/* HEADER */}
                <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 16 }}>

                  <View style={{
                    width: 48, height: 5,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 999,
                    marginBottom: 16,
                  }} />

                  <View style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>

                    <View style={{ width: 44 }}>
                      {step > 1 && (
                        <Pressable
                          onPress={handleBack}
                          style={{ padding: 8, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12 }}
                        >
                          <Ionicons name="chevron-back" size={20} color="white" />
                        </Pressable>
                      )}
                    </View>

                    <Text style={{ color: "#e3e0f1", fontSize: 17, fontWeight: "800", letterSpacing: -0.3 }}>
                      {step === 1 ? "Select Video" : step === 2 ? "Trim Memory" : "Final Touches"}
                    </Text>


                    <View style={{ width: 44, alignItems: "flex-end" }}>
                      <Pressable
                        onPress={handleClose}
                        style={{ padding: 8, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12 }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* CONTENT */}
                <View style={{ flex: 1 }}>
                  {step === 1 && (
                    <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)} style={{ flex: 1 }}>
                      <Step1 key="s1" />
                    </Animated.View>
                  )}
                  {step === 2 && (
                    <Animated.View entering={SlideInRight.springify().damping(20)} exiting={SlideOutLeft} style={{ flex: 1 }}>
                      <Step2 key="s2" />
                    </Animated.View>
                  )}
                  {step === 3 && (
                    <Animated.View entering={SlideInRight.springify().damping(20)} exiting={SlideOutLeft} style={{ flex: 1 }}>
                      <Step3 key="s3" />
                    </Animated.View>
                  )}
                </View>

              </Pressable>
            </Animated.View>
          </GestureDetector>
        </Pressable>

      </GestureHandlerRootView>
    </Modal>
  );
};