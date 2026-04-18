import React from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  name: string;
  setName: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  errors?: {
    name?: string;
    description?: string;
  };
}

export const MetadataForm = ({ name, setName, description, setDescription, errors }: Props) => {
  return (
    <View className="bg-[#1A1A2E] p-6 rounded-[32px] border border-white/5">
      {/* Name Field */}
      <View className="mb-6">
        <Text className="text-white/40 text-xs mb-2 ml-1">Memory Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name your memory..."
          placeholderTextColor="#444"
          className={`bg-[#0F0F1A] text-white p-4 rounded-2xl border font-semibold ${
            errors?.name ? "border-red-500/50" : "border-white/5"
          }`}
        />
        {errors?.name && (
          <Animated.Text 
            entering={FadeInDown.duration(300)}
            className="text-red-400 text-[11px] font-bold mt-2 ml-2"
          >
            ⚠ {errors.name}
          </Animated.Text>
        )}
      </View>

      {/* Description Field */}
      <View>
        <Text className="text-white/40 text-xs mb-2 ml-1">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What happened?"
          placeholderTextColor="#444"
          multiline
          numberOfLines={4}
          className={`bg-[#0F0F1A] text-white p-4 rounded-2xl border h-32 ${
            errors?.description ? "border-red-500/50" : "border-white/5"
          }`}
          style={{ textAlignVertical: 'top' }}
        />
        {errors?.description && (
          <Animated.Text 
            entering={FadeInDown.duration(300)}
            className="text-red-400 text-[11px] font-bold mt-2 ml-2"
          >
            ⚠ {errors.description}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};