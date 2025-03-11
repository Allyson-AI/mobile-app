import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/typography";
import {
  IconX,
  IconChevronDown,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import * as Haptics from "expo-haptics";
import { Card } from "../ui/card";

export default function SettingsDialog({ isOpen, setIsOpen }) {
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showSessionSettings, setShowSessionSettings] = useState(true);
  const [globalVariables, setGlobalVariables] = useState([
    { name: "", value: "" },
  ]);
  const [sessionVariables, setSessionVariables] = useState([
    { name: "", value: "" },
  ]);
  const [maxSteps, setMaxSteps] = useState("100");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddVariable = (isGlobal) => {
    if (isGlobal) {
      setGlobalVariables([...globalVariables, { name: "", value: "" }]);
    } else {
      setSessionVariables([...sessionVariables, { name: "", value: "" }]);
    }
  };

  const handleDeleteVariable = (index, isGlobal) => {
    if (isGlobal) {
      const newVariables = globalVariables.filter((_, i) => i !== index);
      setGlobalVariables(newVariables);
    } else {
      const newVariables = sessionVariables.filter((_, i) => i !== index);
      setSessionVariables(newVariables);
    }
  };

  const handleEditVariable = (index) => {
    setEditingIndex(index);
  };

  const handleSaveVariable = () => {
    setEditingIndex(null);
  };

  const handleCancelVariable = () => {
    setEditingIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="">
      <DialogContent className="h-5/6 mx-auto my-auto">
        <DialogHeader className="">
          <View className="flex-row justify-between items-center w-full">
            <DialogTitle className="text-lg">Settings</DialogTitle>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsOpen(false);
              }}
              className="p-2"
            >
              <IconX size={24} color="#a1a1aa" />
            </Pressable>
          </View>
        </DialogHeader>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Session Settings Section */}
          <Card className="rounded-lg p-4 mb-4">
            <Pressable
              onPress={() => setShowSessionSettings(!showSessionSettings)}
              className="flex-row justify-between items-center"
            >
              <View>
                <Text className="text-base font-medium text-white">
                  Session Settings
                </Text>
                <Text className="text-sm text-zinc-400">
                  Add details before starting a session
                </Text>
              </View>
              <IconChevronDown size={20} color="#a1a1aa" />
            </Pressable>

            {showSessionSettings && (
              <View className="mt-4 space-y-4">
                {/* Variables Section */}
                <View>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white text-lg font-medium">
                      Variables
                    </Text>
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={() => handleAddVariable(false)}
                    >
                      <IconPlus size={20} color="#a1a1aa" />
                    </Button>
                  </View>
                  {/* Session Variables List */}
                  {sessionVariables.map((variable, index) => (
                    <View key={index} className="mt-4">
                      <View className="flex-row justify-between items-center">
                        {editingIndex === index ? (
                          <View className="flex-1 flex-row items-center space-x-2">
                            <Input
                              value={variable.name}
                              onChangeText={(text) => {
                                const newVariables = [...sessionVariables];
                                newVariables[index].name = text;
                                setSessionVariables(newVariables);
                              }}
                              placeholder={`Variable ${index + 1}`}
                              className="flex-1 bg-zinc-900"
                            />
                            <Pressable onPress={handleSaveVariable}>
                              <IconCheck size={20} color="#a1a1aa" />
                            </Pressable>
                            <Pressable onPress={handleCancelVariable}>
                              <IconX size={20} color="#a1a1aa" />
                            </Pressable>
                          </View>
                        ) : (
                          <>
                            <Pressable
                              onPress={() => handleEditVariable(index)}
                            >
                              <Text className="text-white">
                                {variable.name || `Variable ${index + 1}`}
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() => handleDeleteVariable(index, false)}
                            >
                              <IconX size={20} color="#a1a1aa" />
                            </Pressable>
                          </>
                        )}
                      </View>
                      <Input
                        value={variable.value}
                        onChangeText={(text) => {
                          const newVariables = [...sessionVariables];
                          newVariables[index].value = text;
                          setSessionVariables(newVariables);
                        }}
                        placeholder="Value"
                        className="mt-2 bg-zinc-900"
                      />
                    </View>
                  ))}
                </View>

                {/* Max Steps Section */}
                <View className="mt-4">
                  <Text className="text-white mb-1">Max Steps</Text>
                  <Input
                    value={maxSteps}
                    onChangeText={setMaxSteps}
                    keyboardType="numeric"
                    className="bg-zinc-900"
                  />
                </View>
              </View>
            )}
          </Card>

          {/* Global Settings Section */}
          <Card className="rounded-lg p-4 mb-4">
            <Pressable
              onPress={() => setShowGlobalSettings(!showGlobalSettings)}
              className="flex-row justify-between items-center"
            >
              <View>
                <Text className="text-base font-medium text-white">
                  Global Settings
                </Text>
              </View>
              <IconChevronDown size={20} color="#a1a1aa" />
            </Pressable>

            {showGlobalSettings && (
              <View className="mt-4 space-y-4">
                {/* Global Variables Section */}
                <View>
                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <Text className="text-white text-lg font-medium">Variables</Text>
                      <Text className="text-sm text-zinc-400">Add global variables available to all sessions</Text>
                    </View>
                    <Button
                      variant="outline"
                      size="icon"
                      onPress={() => handleAddVariable(true)}
                    >
                      <IconPlus size={20} color="#a1a1aa" />
                    </Button>
                  </View>

                  {/* Global Variables List */}
                  {globalVariables.map((variable, index) => (
                    <View key={index} className="mt-4">
                      <View className="flex-row justify-between items-center">
                        {editingIndex === index ? (
                          <View className="flex-1 flex-row items-center space-x-2">
                            <Input
                              value={variable.name}
                              onChangeText={(text) => {
                                const newVariables = [...globalVariables];
                                newVariables[index].name = text;
                                setGlobalVariables(newVariables);
                              }}
                              placeholder={`Variable ${index + 1}`}
                              className="flex-1 bg-zinc-900"
                            />
                            <Pressable onPress={handleSaveVariable}>
                              <IconCheck size={20} color="#a1a1aa" />
                            </Pressable>
                            <Pressable onPress={handleCancelVariable}>
                              <IconX size={20} color="#a1a1aa" />
                            </Pressable>
                          </View>
                        ) : (
                          <>
                            <Pressable onPress={() => handleEditVariable(index)}>
                              <Text className="text-white">
                                {variable.name || `Variable ${index + 1}`}
                              </Text>
                            </Pressable>
                            <Pressable onPress={() => handleDeleteVariable(index, true)}>
                              <IconX size={20} color="#a1a1aa" />
                            </Pressable>
                          </>
                        )}
                      </View>
                      <Input
                        value={variable.value}
                        onChangeText={(text) => {
                          const newVariables = [...globalVariables];
                          newVariables[index].value = text;
                          setGlobalVariables(newVariables);
                        }}
                        placeholder="Value"
                        className="mt-2 bg-zinc-900"
                      />
                    </View>
                  ))}
                </View>

                {/* Messages Section */}
                <View className="mt-4">
                  <Text className="text-base font-medium text-white mb-4">
                    Messages
                  </Text>

                  <View className="bg-zinc-900 rounded-lg p-4 mb-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white">Evaluation</Text>
                      <Switch checked={true} onValueChange={() => {}} />
                    </View>
                  </View>

                  <View className="bg-zinc-900 rounded-lg p-4">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white">Memory</Text>
                      <Switch checked={true} onValueChange={() => {}} />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Card>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
