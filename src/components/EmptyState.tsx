import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const EmptyState = ({ title, description, iconName }: Props) => {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">

      {/* GLOW */}
      <View className="relative mb-12">
        <View className="w-48 h-48 rounded-[40px] bg-[#292935] items-center justify-center border border-white/5 overflow-hidden">
          <View className="absolute inset-0 bg-[#7c3aed]/10" />

          <View className="items-center gap-4">
            <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-1">
                <Ionicons name={iconName} size={48} color="#7c3aed" style={{ opacity: 0.8 }} />
            </View>

            <View className="flex-row gap-2">
              <View className="w-2 h-2 rounded-full bg-[#7c3aed]/30" />
              <View className="w-2 h-2 rounded-full bg-[#7c3aed]/50" />
              <View className="w-2 h-2 rounded-full bg-[#7c3aed]/30" />
            </View>
          </View>
        </View>
      </View>

      {/* TEXT */}
      <View className="items-center max-w-xs">
        <Text className="text-3xl font-black text-[#e3e0f1] mb-3 text-center tracking-tight">
          {title}
        </Text>

        <Text className="text-[#ccc3d8]/60 text-center leading-6 font-medium">
          {description}
        </Text>
      </View>

    </View>
  );
};