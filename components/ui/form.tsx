// This project uses code from shadcn/ui.
// The code is licensed under the MIT License.
// https://github.com/shadcn-ui/ui
import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Calendar as CalendarIcon, X } from "~/components/Icons";
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetOpenTrigger,
  BottomSheetView,
} from "~/components/ui/bottom-sheet";
import { Calendar } from "~/components/ui/calendar";
import { Combobox } from "~/components/ui/combobox";
import { Button, buttonTextVariants } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label, LabelText } from "~/components/ui/label";
import { RadioGroup } from "~/components/ui/radio-group";
import { Select } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Text } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { nativeID } = itemContext;
  return {
    nativeID,
    name: fieldContext.name,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const nativeID = React.useId();
  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemNativeID } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn("pb-2 px-px", error && "text-destructive", className)}
      {...props}
    >
      <LabelText nativeID={formItemNativeID}>{props.children}</LabelText>
    </Label>
  );
});
FormLabel.displayName = "FormLabel";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionNativeID } = useFormField();
  return (
    <Text
      ref={ref}
      nativeID={formDescriptionNativeID}
      className={cn("text-sm text-muted-foreground pt-1", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageNativeID } = useFormField();
    const body = error ? String(error?.message) : children;
    if (!body) {
      return null;
    }
    return (
      <Animated.Text
        entering={FadeInDown}
        exiting={FadeOut.duration(275)}
        ref={ref}
        nativeID={formMessageNativeID}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </Animated.Text>
    );
  }
);
FormMessage.displayName = "FormMessage";
const FormInput = React.forwardRef(
  ({ label, description, onChange, ...props }, ref) => {
    const inputRef = React.useRef(null);
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    React.useImperativeHandle(
      ref,
      () => {
        if (!inputRef.current) {
          return {};
        }
        return inputRef.current;
      },
      [inputRef.current]
    );
    function handleOnLabelPress() {
      if (!inputRef.current) {
        return;
      }
      if (inputRef.current.isFocused()) {
        inputRef.current?.blur();
      } else {
        inputRef.current?.focus();
      }
    }
    return (
      <FormItem>
        {!!label && (
          <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
            {label}
          </FormLabel>
        )}

        <Input
          ref={inputRef}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onChangeText={onChange}
          {...props}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormInput.displayName = "FormInput";
const FormTextarea = React.forwardRef(
  ({ label, description, onChange, ...props }, ref) => {
    const textareaRef = React.useRef(null);
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    React.useImperativeHandle(
      ref,
      () => {
        if (!textareaRef.current) {
          return {};
        }
        return textareaRef.current;
      },
      [textareaRef.current]
    );
    function handleOnLabelPress() {
      if (!textareaRef.current) {
        return;
      }
      if (textareaRef.current.isFocused()) {
        textareaRef.current?.blur();
      } else {
        textareaRef.current?.focus();
      }
    }
    return (
      <FormItem>
        {!!label && (
          <FormLabel nativeID={formItemNativeID} onPress={handleOnLabelPress}>
            {label}
          </FormLabel>
        )}

        <Textarea
          ref={textareaRef}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onChangeText={onChange}
          {...props}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormTextarea.displayName = "FormTextarea";
const FormCheckbox = React.forwardRef(
  ({ label, description, value, onChange, ...props }, ref) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    function handleOnLabelPress() {
      onChange?.(!value);
    }
    return (
      <FormItem className="px-1">
        <View className="flex-row gap-3 items-center">
          <Checkbox
            ref={ref}
            aria-labelledby={formItemNativeID}
            aria-describedby={
              !error
                ? `${formDescriptionNativeID}`
                : `${formDescriptionNativeID} ${formMessageNativeID}`
            }
            aria-invalid={!!error}
            onCheckedChange={onChange}
            checked={value}
            {...props}
          />
          {!!label && (
            <FormLabel
              className="pb-0"
              nativeID={formItemNativeID}
              onPress={handleOnLabelPress}
            >
              {label}
            </FormLabel>
          )}
        </View>
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormCheckbox.displayName = "FormCheckbox";
const FormDatePicker = React.forwardRef(
  ({ label, description, value, onChange, ...props }, ref) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    return (
      <FormItem>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        <BottomSheet>
          <BottomSheetOpenTrigger asChild>
            <Button
              variant="outline"
              className="flex-row gap-3 justify-start px-3 relative"
              ref={ref}
              aria-labelledby={formItemNativeID}
              aria-describedby={
                !error
                  ? `${formDescriptionNativeID}`
                  : `${formDescriptionNativeID} ${formMessageNativeID}`
              }
              aria-invalid={!!error}
            >
              {({ pressed }) => (
                <>
                  <CalendarIcon
                    className={buttonTextVariants({
                      variant: "outline",
                      className: cn(
                        !value && "opacity-80",
                        pressed && "opacity-60"
                      ),
                    })}
                    size={18}
                  />
                  <Text
                    className={buttonTextVariants({
                      variant: "outline",
                      className: cn(
                        "font-normal",
                        !value && "opacity-70",
                        pressed && "opacity-50"
                      ),
                    })}
                  >
                    {value ? value : "Pick a date"}
                  </Text>
                  {!!value && (
                    <Button
                      className="absolute right-0 active:opacity-70 native:pr-3"
                      variant="ghost"
                      onPress={() => {
                        onChange?.("");
                      }}
                    >
                      <X size={18} className="text-muted-foreground text-xs" />
                    </Button>
                  )}
                </>
              )}
            </Button>
          </BottomSheetOpenTrigger>
          <BottomSheetContent>
            <BottomSheetView hadHeader={false} className="pt-2">
              <Calendar
                style={{ height: 358 }}
                onDayPress={(day) => {
                  onChange?.(day.dateString === value ? "" : day.dateString);
                }}
                markedDates={{
                  [value ?? ""]: {
                    selected: true,
                  },
                }}
                current={value} // opens calendar on selected date
                {...props}
              />
              <View className={"pb-2 pt-4"}>
                <BottomSheetCloseTrigger asChild>
                  <Button>
                    <Text>Close</Text>
                  </Button>
                </BottomSheetCloseTrigger>
              </View>
            </BottomSheetView>
          </BottomSheetContent>
        </BottomSheet>
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormDatePicker.displayName = "FormDatePicker";
const FormRadioGroup = React.forwardRef(
  ({ label, description, value, onChange, ...props }, ref) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    return (
      <FormItem className="gap-3">
        <View>
          {!!label && (
            <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>
          )}
          {!!description && (
            <FormDescription className="pt-0">{description}</FormDescription>
          )}
        </View>
        <RadioGroup
          ref={ref}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onValueChange={onChange}
          value={value}
          {...props}
        />

        <FormMessage />
      </FormItem>
    );
  }
);
FormRadioGroup.displayName = "FormRadioGroup";
const FormCombobox = React.forwardRef(
  ({ label, description, value, onChange, ...props }, ref) => {
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    return (
      <FormItem>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        <Combobox
          ref={ref}
          placeholder="Select framework"
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          selectedItem={value}
          onSelectedItemChange={onChange}
          {...props}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormCombobox.displayName = "FormCombobox";
/**
 * @prop {children}
 * @example
 *  <SelectTrigger className='w-[250px]'>
      <SelectValue
        className='text-foreground text-sm native:text-lg'
        placeholder='Select a fruit'
      />
    </SelectTrigger>
    <SelectContent insets={contentInsets} className='w-[250px]'>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem label='Apple' value='apple'>
          Apple
        </SelectItem>
      </SelectGroup>
    </SelectContent>
 */
const FormSelect = React.forwardRef(
  ({ label, description, onChange, value, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    return (
      <FormItem>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        <Select
          ref={ref}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          open={open}
          onOpenChange={setOpen}
          value={value}
          onValueChange={onChange}
          {...props}
        />
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormSelect.displayName = "FormSelect";
const FormSwitch = React.forwardRef(
  ({ label, description, value, onChange, ...props }, ref) => {
    const switchRef = React.useRef(null);
    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();
    React.useImperativeHandle(
      ref,
      () => {
        if (!switchRef.current) {
          return {};
        }
        return switchRef.current;
      },
      [switchRef.current]
    );
    function handleOnLabelPress() {
      onChange?.(!value);
    }
    return (
      <FormItem className="px-1">
        <View className="flex-row gap-3 items-center">
          <Switch
            ref={switchRef}
            aria-labelledby={formItemNativeID}
            aria-describedby={
              !error
                ? `${formDescriptionNativeID}`
                : `${formDescriptionNativeID} ${formMessageNativeID}`
            }
            aria-invalid={!!error}
            onCheckedChange={onChange}
            checked={value}
            {...props}
          />
          {!!label && (
            <FormLabel
              className="pb-0"
              nativeID={formItemNativeID}
              onPress={handleOnLabelPress}
            >
              {label}
            </FormLabel>
          )}
        </View>
        {!!description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
);
FormSwitch.displayName = "FormSwitch";
export {
  Form,
  FormCheckbox,
  FormCombobox,
  FormDatePicker,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormTextarea,
  useFormField,
};
