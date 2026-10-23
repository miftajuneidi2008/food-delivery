import { api } from "@/lib/axios";
import { RestaurantType } from "@food-delivery/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function EditRestaurantScreen() {
  const queryClient = useQueryClient();

  const { data: restaurant } = useQuery<RestaurantType | null>({
    queryKey: ["my-restaurant"],
    queryFn: () =>
      api
        .get<RestaurantType | null>("/restaurants/mine")
        .then((res) => res.data),
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description ?? "");
      setAddress(restaurant.address);
      setCuisineType(restaurant.cuisineType);
      setImageUrl(restaurant.imageUrl);
    }
  }, [restaurant]);

  async function pickAndUploadImage() {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (picked.canceled) return;
    const asset = picked.assets[0];
    setPreviewUri(asset.uri);

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
      const url = res.data?.url;
      if (!url) throw new Error("Server did not return an image URL");
      setImageUrl(url);
    } catch (e: any) {
      setPreviewUri(null);
      Alert.alert("Upload failed", e?.response?.data?.message ?? e.message);
    } finally {
      setIsUploading(false);
    }
  }

  const { mutate: updateRestaurant, isPending } = useMutation({
    mutationFn: () =>
      api.patch(`/restaurants/${restaurant?.id}`, {
        name,
        description,
        address,
        cuisineType,
        imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      router.back();
    },
    onError: (e: any) => {
      Alert.alert(
        "Error",
        e?.response?.data?.message ?? "Something went wrong",
      );
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Restaurant</Text>

      {imageUrl || previewUri ? (
        <Pressable
          onPress={() => void pickAndUploadImage()}
          disabled={isUploading}
        >
          <Image
            source={{ uri: previewUri ?? imageUrl! }}
            style={styles.preview}
            resizeMode="cover"
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
            {isUploading ? "Uploading..." : "Tap to change image"}
          </Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="Restaurant name"
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
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine type"
        value={cuisineType}
        onChangeText={setCuisineType}
      />

      <Pressable
        style={styles.button}
        onPress={() => {
          updateRestaurant();
        }}
        disabled={isPending || isUploading}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
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
  imagePickerText: {
    color: "#999",
    fontSize: 14,
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
