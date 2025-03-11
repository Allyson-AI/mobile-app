import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  IconDownload,
  IconEye,
  IconThumbUp,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from "@tabler/icons-react-native";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/typography";
import { Input } from "~/components/ui/input";
import { useAuth } from "@clerk/clerk-expo";
import FileDialog from "./file-dialog";
import { useFileDownload } from "../../hooks/useFileDownload";
import { Separator } from "../ui/separator";
import Markdown from "react-native-markdown-display";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

export default function Messages({
  messages,
  files,
  sessionId,
  responseQuality,
  updateResponseQuality,
}) {
  const { downloadFile } = useFileDownload();

  const [inputValues, setInputValues] = useState({});
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef(null);
  const [prevMessageCount, setPrevMessageCount] = useState(
    messages?.length || 0
  );
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (messages?.length > 0) {
      const initialInputValues = {};
      messages.forEach((message, index) => {
        if (message.human_input) {
          if (!inputValues[index]) {
            initialInputValues[index] = message.human_input.map((input) => ({
              ...input,
              value: input.value || "",
            }));
          } else {
            initialInputValues[index] = message.human_input.map((input) => {
              const existingInput = inputValues[index].find(
                (item) => item.title === input.title
              );
              return {
                ...input,
                value: input.value || existingInput?.value || "",
              };
            });
          }
        }
      });

      setInputValues((prev) => ({
        ...prev,
        ...initialInputValues,
      }));
    }
  }, [messages]);

  const handleInputChange = (messageIndex, inputTitle, value) => {
    setInputValues((prev) => ({
      ...prev,
      [messageIndex]: (
        prev[messageIndex] ||
        messages[messageIndex].human_input.map((input) => ({
          ...input,
          value: "",
        }))
      ).map((input) =>
        input.title === inputTitle ? { ...input, value } : input
      ),
    }));
  };

  const handleSend = async (messageIndex, inputRequests) => {
    const messageInputs = inputValues[messageIndex];
    const updatedInputRequests = inputRequests.map((request) => {
      const matchingInput = messageInputs.find(
        (input) => input.title === request.title
      );
      return {
        ...request,
        value: matchingInput?.value || "",
      };
    });

    setIsSending(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/v1/sessions/${sessionId}/update-human-input`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            humanInputResponse: updatedInputRequests,
            messageIndex,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update message");
    } catch (error) {
      console.error("Error updating message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const currentMessageCount = messages?.length || 0;
    if (currentMessageCount > prevMessageCount) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
    setPrevMessageCount(currentMessageCount);
  }, [messages, prevMessageCount]);

  const handleViewFile = (filePath) => {
    const fileInfo = files.find((f) => f.filename === filePath);
    if (fileInfo) {
      setSelectedFile(fileInfo);
      setIsModalOpen(true);
    }
  };

  const handleLongPress = async (text) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      contentContainerStyle={{ paddingBottom: 0 }}
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }}
    >
      {messages?.length > 0 ? (
        messages.map((message, i) => {
          const assistantMessagesCount = messages
            .slice(0, i + 1)
            .filter((msg) => msg.role === "assistant").length;

          return (
            <View key={`msg-${i}`} className="mb-2">
              {message.role === "user" ? (
                
                  <Card className="p-4 ml-auto">
                    <TouchableOpacity
                  onLongPress={() => handleLongPress(message.content)}
                >
                  <Text className="text-sm">{message.content}</Text>
                </TouchableOpacity>
              </Card>
              ) : (
                <View key={`msg-${i}`}>
                  {/* Add Step Counter */}
                  <View className="flex flex-row items-center gap-2 justify-center mb-2">
                    <Separator className="flex-1 my-4" />
                    <Text className="text-sm text-zinc-400">
                      {message?.agent_data?.action[0].done
                        ? "Task Completed"
                        : `Step ${assistantMessagesCount}`}
                    </Text>
                    <Separator className="flex-1 my-4" />
                  </View>
                  {/* Human Input Section */}
                  {message?.human_input && (
                    <Card className="p-4 mb-2">
                      {message.human_input.map((input, inputIndex) => (
                        <View key={`input-${inputIndex}`} className="mb-4">
                          <Text className="text-sm font-semibold mb-1">
                            {input.title}
                          </Text>
                          <Text className="text-xs text-zinc-400 mb-2">
                            {input.description}
                          </Text>
                          <Input
                            value={
                              inputValues[i]?.find(
                                (item) => item.title === input.title
                              )?.value || ""
                            }
                            onChangeText={(value) =>
                              handleInputChange(i, input.title, value)
                            }
                            placeholder={input.title}
                            editable={!input.value}
                          />
                        </View>
                      ))}
                      {!message.human_input.some((input) => !!input.value) && (
                        <Button
                          variant="outline"
                          onPress={() => handleSend(i, message.human_input)}
                          disabled={isSending}
                          className="w-full"
                        >
                          {isSending ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text>Submit</Text>
                          )}
                        </Button>
                      )}
                    </Card>
                  )}

                  {/* Message Content */}
                  {!message?.agent_data?.action[0].done && message?.content && (
                    <View className="flex flex-row items-start gap-2 w-full">
                      <Image
                        source={require("../../assets/allyson-a.png")}
                        className="w-5 h-5 mt-1"
                        resizeMode="contain"
                      />
                      <View className="flex-1">
                        <Card className="p-4 w-full">
                          <TouchableOpacity
                            onLongPress={() => handleLongPress(message.content)}
                          >
                            <Text className="text-sm">{message.content}</Text>
                          </TouchableOpacity>
                        </Card>
                      </View>
                    </View>
                  )}

                  {/* Completed Tasks Section */}
                  {message?.agent_data?.action?.map(
                    (actionItem, index) =>
                      actionItem.done && (
                        <View
                          key={`done-${index}`}
                          className="flex flex-row items-start gap-2 w-full mt-4"
                        >
                          <Image
                            source={require("../../assets/allyson-a.png")}
                            className="w-5 h-5 mt-1"
                            resizeMode="contain"
                          />
                          <View className="flex-1">
                           
                              <Card
                                key={`done-${index}`}
                                className="p-4 w-full"
                              >
                                <TouchableOpacity
                                  onLongPress={() =>
                                    handleLongPress(actionItem.done.text)
                                  }
                                >
                                  <Markdown style={markdownStyles}>
                                    {actionItem.done.text}
                                  </Markdown>
                                  </TouchableOpacity>
                                <View className="flex flex-row items-center gap-1 justify-end">
                                  {responseQuality === "noResponse" ? (
                                    // Show both buttons when no response
                                    <>
                                      <TouchableOpacity
                                        onPress={() =>
                                          updateResponseQuality("good")
                                        }
                                      >
                                        <IconThumbUp
                                          size={20}
                                          color="#a1a1aa"
                                        />
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() =>
                                          updateResponseQuality("bad")
                                        }
                                      >
                                        <IconThumbDown
                                          size={20}
                                          color="#a1a1aa"
                                        />
                                      </TouchableOpacity>
                                    </>
                                  ) : (
                                    // Show filled selected button and outline unselected
                                    <>
                                      {responseQuality === "good" ? (
                                        <TouchableOpacity
                                          onPress={() =>
                                            updateResponseQuality("noResponse")
                                          }
                                        >
                                          <IconThumbUpFilled
                                            size={20}
                                            color="transparent"
                                            fill="#a1a1aa"
                                          />
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity
                                          onPress={() =>
                                            updateResponseQuality("good")
                                          }
                                        >
                                          <IconThumbUp
                                            size={20}
                                            color="#a1a1aa"
                                          />
                                        </TouchableOpacity>
                                      )}
                                      {responseQuality === "bad" ? (
                                        <TouchableOpacity
                                          onPress={() =>
                                            updateResponseQuality("noResponse")
                                          }
                                        >
                                          <IconThumbDownFilled
                                            size={20}
                                            color="transparent"
                                            fill="#a1a1aa"
                                          />
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity
                                          onPress={() =>
                                            updateResponseQuality("bad")
                                          }
                                        >
                                          <IconThumbDown
                                            size={20}
                                            color="#a1a1aa"
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </>
                                  )}
                                </View>
                              </Card>
                          </View>
                        </View>
                      )
                  )}

                  {/* File Actions */}
                  {message?.agent_data?.action?.map(
                    (action, actionIndex) =>
                      action.save_to_file && (
                        <Card key={`file-${actionIndex}`} className="p-4 mb-2 mt-4">
                          <View className="flex-row justify-between items-center">
                            <Text className="text-sm flex-1" numberOfLines={1}>
                              {action.save_to_file.file_path}
                            </Text>
                            <View className="flex-row gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onPress={() =>
                                  handleViewFile(action.save_to_file.file_path)
                                }
                              >
                                <IconEye size={20} color="#a1a1aa" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onPress={() => {
                                  downloadFile(action.save_to_file);
                                }}
                              >
                                <IconDownload size={20} color="#a1a1aa" />
                              </Button>
                            </View>
                          </View>
                        </Card>
                      )
                  )}
                </View>
              )}
            </View>
          );
        })
      ) : (
        <Card className="p-4">
          <Text className="text-sm text-center text-zinc-400">
            No messages yet...
          </Text>
        </Card>
      )}
      <FileDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedFile={selectedFile}
      />
    </ScrollView>
  );
}

const markdownStyles = {
  body: { fontSize: 12, color: "#e4e4e7" },
  heading1: { fontSize: 24, fontWeight: "bold", color: "#e4e4e7" },
  heading2: { fontSize: 22, fontWeight: "bold", color: "#e4e4e7" },
  heading3: { fontSize: 20, fontWeight: "bold", color: "#e4e4e7" },
  heading4: { fontSize: 18, fontWeight: "bold", color: "#e4e4e7" },
  heading5: { fontSize: 16, fontWeight: "bold", color: "#e4e4e7" },
  heading6: { fontSize: 14, fontWeight: "bold", color: "#e4e4e7" },
  hr: { borderBottomWidth: 1, borderBottomColor: "#e4e4e7", marginVertical: 8 },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  s: { textDecorationLine: "line-through" },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#e4e4e7",
    paddingLeft: 8,
  },
  bullet_list: { marginVertical: 8 },
  ordered_list: { marginVertical: 8 },
  list_item: { marginVertical: 4 },
  code_inline: { backgroundColor: "#e4e4e7", padding: 4, borderRadius: 4 },
  code_block: { backgroundColor: "#e4e4e7", padding: 8, borderRadius: 4 },
  fence: { backgroundColor: "#e4e4e7", padding: 8, borderRadius: 4 },
  table: { borderWidth: 1, borderColor: "#e4e4e7" },
  thead: { backgroundColor: "#e4e4e7" },
  tbody: {},
  th: { padding: 8, borderWidth: 1, borderColor: "#e4e4e7" },
  tr: {},
  td: { padding: 8, borderWidth: 1, borderColor: "#e4e4e7" },
  link: { color: "#e4e4e7" },
  blocklink: { color: "#e4e4e7" },
  image: { width: "100%", height: "auto" },
  text: { color: "#e4e4e7" },
  textgroup: {},
  paragraph: { marginVertical: 8 },
  hardbreak: { width: "100%", height: 1, backgroundColor: "#ccc" },
  softbreak: {},
  pre: { backgroundColor: "#f5f5f5", padding: 8, borderRadius: 4 },
  inline: {},
  span: {},
};
