import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function CreateRestaurantScreen() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function pickAndUploadImage() {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (picked.canceled) return;
    const asset = picked.assets[0];

    const form = new FormData();
    form.append("file", {
      uri: asset.uri,
      name: asset.fileName ?? "upload.jpg",
      type: asset.mimeType ?? "image/jpeg",
    } as any);

    try {
      setIsUploading(true);
      const res = await api.post<{ url: string }>(
        "/restaurants/upload-image",
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      console.log(res.data);
      const url = res.data?.url;
      if (!url) throw new Error("Server did not return an image URL");
      setImageUrl(url);
    } catch (e: any) {
      Alert.alert("Upload failed", e?.response?.data?.message ?? e.message);
    } finally {
      setIsUploading(false);
    }
  }

  const { mutate: createRestaurant, isPending } = useMutation({
    mutationFn: () =>
      api.post("/restaurants", {
        name,
        description,
        address,
        cuisineType,
        imageUrl,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData(["my-restaurant"], res.data);
      router.replace("/(owner)/(index)");
    },
    onError: (e: any) => {
      Alert.alert(
        "Error",
        e?.response?.data?.message ?? "Something went wrong",
      );
    },
  });

  function handleSubmit() {
    if (!name || !address || !cuisineType) {
      return Alert.alert("Please fill in all required fields");
    }
    createRestaurant();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create your restaurant</Text>

      {imageUrl ? (
        <Pressable
          onPress={() => void pickAndUploadImage()}
          disabled={isUploading}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.preview}
            resizeMode="cover"
            onLoad={() => console.log("image loaded")}
            onError={(e) => console.log("image error:", e.nativeEvent)}
          />
          <Text style={styles.changeText}>
            {isUploading ? "Uploading..." : "Tap image to change"}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.imagePicker}
          onPress={() => void pickAndUploadImage()}
          disabled={isUploading}
        >
          <Text style={styles.imagePickerText}>
            {isUploading ? "Uploading..." : "Tap to upload restaurant image"}
          </Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Restaurant name *"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <TextInput
        style={styles.input}
        placeholder="Address *"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine type * (e.g. Italian, Chinese)"
        value={cuisineType}
        onChangeText={setCuisineType}
      />

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={isPending || isUploading}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Restaurant</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  imagePicker: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  changeText: {
    color: "#999",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  imagePickerText: { color: "#999", fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
