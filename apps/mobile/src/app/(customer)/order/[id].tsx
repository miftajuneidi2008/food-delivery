import { api } from "@/lib/axios";
import { Order } from "@food-delivery/types";
import { useStripe } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery<Order & { items: any[] }>({
    queryKey: ["order", id],
    queryFn: () =>
      api.get<Order & { items: any[] }>(`/orders/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  async function handlePayment() {
    if (!order) return;
    setPaymentLoading(true);

    try {
      const res = await api.post<{ clientSecret: string }>("/payments/intent", {
        orderId: order.id,
      });

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Food Delivery",
        paymentIntentClientSecret: res.data.clientSecret,
      });

      if (initError) {
        Alert.alert("Payment setup failed", initError.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment failed", paymentError.message);
        return;
      }

      let confirmed = false;
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const { data } = await refetch();
        if (data?.status === "CONFIRMED") {
          confirmed = true;
          break;
        }
      }

      if (confirmed) {
        Alert.alert("Payment confirmed!", "Your order is being prepared.");
      } else {
        Alert.alert(
          "Payment submitted",
          "Your payment is being processed. Check your order status shortly.",
        );
      }
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.message ?? "Something went wrong",
      );
    } finally {
      setPaymentLoading(false);
    }
  }
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>
          {order?.status === "CONFIRMED" ? "✅" : "🎉"}
        </Text>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your order has been received</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>
            {order?.id.slice(0, 8).toUpperCase()}
          </Text>

          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>${order?.totalAmount}</Text>

          <Text style={styles.label}>Delivery to</Text>
          <Text style={styles.value}>{order?.deliveryAddress}</Text>

          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.statusBadge,
              order?.status === "CONFIRMED" ? styles.confirmed : styles.pending,
            ]}
          >
            {order?.status}
          </Text>
        </View>

        {order?.status === "PENDING" && (
          <Pressable
            style={styles.payButton}
            onPress={() => {
              void handlePayment();
            }}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>
                Pay ${order?.totalAmount}
              </Text>
            )}
          </Pressable>
        )}

        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace("/(customer)/(tabs)/(home)")}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    gap: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B35",
  },
  paymentNote: {
    fontSize: 13,
    color: "#999",
    marginBottom: 24,
    fontStyle: "italic",
  },
  confirmed: {
    color: "#16A34A",
  },
  pending: {
    color: "#FF6B35",
  },
  homeButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  payButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
