import { api } from "@/lib/axios";
import { HealthCheckResponse } from "@food-delivery/types";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
  const {
    data: health,
    error,
    isLoading,
  } = useQuery<HealthCheckResponse>({
    queryKey: ["health"],
    queryFn: () =>
      api.get<HealthCheckResponse>("/health").then((res) => res.data),
  });
  return (
    <View className="flex-1 items-center justify-center bg-[#fff] p-6">
      <Text className="text-2xl font-bold mb-1.5 font-700">Food Delivery</Text>
      <Text className="text-sm text-[#999] mb-8">Connection Text</Text>

      {isLoading && <ActivityIndicator size="large" color="#ff6b35" />}

      {health && (
        <View className="bg-[#F0FFF4] rounded-[12] p-5 w-full  items-center">
          <Text className="text-lg font-semibold text-[#22543D]">
            API Status: {health.status}
          </Text>
          <Text className="text-sm text-[#666] mt-1.5">
            {new Date(health.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}

      {error && (
        <View className="w-full items-center rounded-xl bg-[#FFF5F5] p-5">
          <Text className="text-center text-[15px] leading-[22px] text-[#E53E3E]">
            Could not reach the API. Is the server running?
          </Text>
        </View>
      )}
    </View>
  );
}
