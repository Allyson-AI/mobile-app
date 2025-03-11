import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import { IconX, IconEye, IconDownload } from "@tabler/icons-react-native";
import { Button } from "../ui/button";
import { useFileDownload } from "~/hooks/useFileDownload";
import FileDialog from "./file-dialog";
import { Card } from "../ui/card";
import * as Haptics from "expo-haptics";

export default function FilesDialog({ files, isOpen, setIsOpen }) {
  const { downloadFile } = useFileDownload();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

  const handleView = async (file) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFile(file);
    setIsFilePreviewOpen(true);
  };

  const handleDownload = async (file) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await downloadFile(file);
    } catch (error) {
      alert("Error downloading file");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-5/6 mx-auto my-auto">
          <DialogHeader className="">
            <View className="flex-row justify-between items-center w-full">
              <DialogTitle className="text-lg">Session Files</DialogTitle>
              <Pressable onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsOpen(false);
              }} className="p-2">
                <IconX size={24} color="#a1a1aa" />
              </Pressable>
            </View>
          </DialogHeader>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {Array.isArray(files) && files.length > 0 ? (
              <View className="space-y-2">
                {files.map((file, index) => (
                  <Card
                    key={index}
                    className="flex-row justify-between items-center p-4  rounded-lg mb-2"
                  >
                    <Text className="text-zinc-300 flex-1" numberOfLines={1}>
                      {file.filename}
                    </Text>
                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onPress={() => handleView(file)}
                      >
                        <IconEye size={20} color="#a1a1aa" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onPress={() => handleDownload(file)}
                      >
                        <IconDownload size={20} color="#a1a1aa" />
                      </Button>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <View className="items-center py-4">
                <Text className="text-zinc-500">No files uploaded</Text>
              </View>
            )}
          </ScrollView>
        </DialogContent>
      </Dialog>

      <FileDialog
        selectedFile={selectedFile}
        isModalOpen={isFilePreviewOpen}
        setIsModalOpen={setIsFilePreviewOpen}
      />
    </>
  );
}
