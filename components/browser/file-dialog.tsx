import React, { useState, useEffect } from "react";
import { View, Image, ScrollView, Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import WebView from "react-native-webview";
import Markdown from "react-native-markdown-display";
import { useAuth } from "@clerk/clerk-expo";
import { IconDownload, IconX } from "@tabler/icons-react-native";
import { Button } from "../ui/button";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useFileDownload } from "~/hooks/useFileDownload";
import * as Haptics from "expo-haptics";
export default function FileDialog({
  selectedFile,
  isModalOpen,
  setIsModalOpen,
}) {
  const [fileContent, setFileContent] = useState("");
  const { getToken } = useAuth();
  const { downloadFile } = useFileDownload();

  useEffect(() => {
    async function fetchTextContent() {
      if (selectedFile?.filename.match(/\.(txt|md)$/i)) {
        try {
          const token = await getToken();
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/file`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ url: selectedFile.signedUrl }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setFileContent(data.content);
        } catch (error) {
          console.error("Error fetching file content:", error);
          setFileContent("Error loading file content");
        }
      }
    }

    if (selectedFile) {
      fetchTextContent();
    }

    return () => setFileContent("");
  }, [selectedFile]);

  const handleDownload = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await downloadFile(selectedFile);
    } catch (error) {
      alert("Error downloading file");
    }
  };

  const renderContent = () => {
    if (!selectedFile) return null;

    if (selectedFile.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return (
        <Image
          source={{ uri: selectedFile.signedUrl }}
          className="h-[70vh] w-full"
          resizeMode="contain"
        />
      );
    }

    if (selectedFile.filename.match(/\.(pdf)$/i)) {
      return (
        <WebView
          source={{ uri: selectedFile.signedUrl }}
          className="w-full h-[70vh]"
        />
      );
    }

    if (selectedFile.filename.match(/\.md$/i)) {
      return (
        <ScrollView className="max-h-[70vh] px-4">
          <Markdown>{fileContent}</Markdown>
        </ScrollView>
      );
    }

    if (selectedFile.filename.match(/\.txt$/i)) {
      return (
        <ScrollView
          className="flex-1 max-h-[70vh] p-4 bg-zinc-900 rounded-md z-50"
          showsVerticalScrollIndicator={true}
        >
          <Text className="font-mono flex-1 whitespace-pre-wrap">
            {fileContent}
          </Text>
        </ScrollView>
      );
    }

    return (
      <View className="items-center py-4">
        <Text className="text-zinc-500">
          This file type cannot be previewed. Please download to view.
        </Text>
      </View>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="h-5/6 my-auto">
        <DialogHeader>
          <View className="flex-row justify-between items-center w-full">
            <DialogTitle>{selectedFile?.filename}</DialogTitle>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsModalOpen(false);
              }}
            >
              <IconX size={24} color="#a1a1aa" />
            </Pressable>
          </View>
        </DialogHeader>
        <View className="flex-1">
          {renderContent()}
        </View>
        <Button
          variant="outline"
          className="w-full flex-row items-center justify-center gap-2 mt-4"
          onPress={handleDownload}
        >
          <IconDownload size={20} color="#a1a1aa" />
          <Text className="text-sm text-zinc-400">Download</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
