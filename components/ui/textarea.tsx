import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { Input } from "./input";
import { Text } from "./typography";
import {
  IconPaperclip,
  IconCalendarMonth,
  IconLoader2,
  IconFile,
  IconArrowUp,
} from "@tabler/icons-react-native";
import { cn } from "~/lib/utils";

const Textarea = React.forwardRef(
  (
    {
      className,
      multiline = true,
      numberOfLines = 4,
      placeholderClassName,
      ...props
    },
    ref
  ) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

const InboxTextarea = React.forwardRef(
  (
    {
      className,
      draft,
      onSend,
      value,
      onChange,
      calendarInvite,
      onCalendarInviteChange,
      createCalendarInvite,
      isCreatingInvite,
      isSendingEmail,
      isSent,
      attachments,
      onAttach,
      onRemoveAttachment,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [localCalendarInvite, setLocalCalendarInvite] =
      useState(calendarInvite);

    useEffect(() => {
      setLocalCalendarInvite(calendarInvite);
    }, [calendarInvite]);

    const handleCalendarInviteChange = (updatedInvite) => {
      setLocalCalendarInvite(updatedInvite);
      onCalendarInviteChange(updatedInvite);
    };

    const handleAttach = () => {
      // Implement file attachment logic for React Native
      // You might need to use a library like expo-document-picker
    };

    const toggleCalendarDialog = () => {
      setIsCalendarDialogOpen(!isCalendarDialogOpen);
    };

    return (
      <View className="relative z-10 rounded-xl bg-background border">
        {!isSent && (attachments.length > 0 || localCalendarInvite) && (
          <ScrollView className="max-h-40 p-3">
            <View className="flex flex-row flex-wrap gap-2">
              {attachments.map((file, index) => (
                <View
                  key={index}
                  className="flex-row border items-center rounded-lg p-2"
                >
                  <IconFile className="h-[1.2rem] w-[1.2rem] mr-2" />
                  <Text className="text-sm truncate max-w-[150px]">
                    {file.name || file.filename}
                  </Text>
                  <TouchableOpacity onPress={() => onRemoveAttachment(index)}>
                    <Text className="ml-2 text-gray-500">×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {localCalendarInvite && (
                <TouchableOpacity
                  className="flex-row border w-full items-center rounded-lg p-2"
                  onPress={toggleCalendarDialog}
                >
                  {/* Replace with appropriate icon component */}
                  <View className="h-4 w-4 mr-2 bg-gray-300" />
                  <Text className="text-sm">
                    {localCalendarInvite.title} - {localCalendarInvite.date} (
                    {localCalendarInvite.startTime}-
                    {localCalendarInvite.endTime})
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCalendarInviteChange(null);
                    }}
                  >
                    <Text className="ml-2 text-gray-500">×</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}
        <TextInput
          ref={textareaRef}
          className={cn(
            "w-full border border-border flex-1 p-3 pb-1.5 text-sm",
            "min-h-[42px] max-h-[384px]",
            "bg-transparent",
            className
          )}
          value={value}
          onChangeText={onChange}
          editable={!isSent}
          multiline
          {...props}
        />
        {!isSent && (
          <View className="flex-row items-center gap-2 p-3">
            <View className="flex-row">
              <Button
                variant="outline"
                size="icon"
                onPress={handleAttach}
                className="w-8 h-8 mr-3 rounded-lg"
              >
                <IconPaperclip className="h-[1.2rem] w-[1.2rem]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onPress={createCalendarInvite}
                disabled={isCreatingInvite}
                className="w-8 h-8 rounded-lg"
              >
                {isCreatingInvite ? (
                  <IconLoader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
                ) : (
                  <IconCalendarMonth className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </View>
            <Button
              onPress={(e) => {
                e.preventDefault();
                onSend();
              }}
              className="ml-auto h-8 px-3"
              variant="outline"
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <IconLoader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
              ) : (
                <IconArrowUp className="h-[1.2rem] w-[1.2rem] mr-2" />
              )}
              <Text className="text-sm">Send</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
);

InboxTextarea.displayName = "InboxTextarea";

export { Textarea, InboxTextarea };
