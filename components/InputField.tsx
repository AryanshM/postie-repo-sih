import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import React from "react";

interface InputFieldProps {
  heading?: string;
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  textClassName?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export default function InputField({
  heading,
  placeholder,
  className,
  value,
  onChangeText,
  editable,
  textClassName,
  keyboardType,
}: InputFieldProps) {
  return (
    <View className={`w-full ${className}`}>
      <Text
        className={`text-sm ${
          textClassName ? textClassName : "text-[#333]"
        } font-semibold`}
      >
        {heading}
      </Text>

      <TextInput
        className="border border-gray-200  bg-[#F9F9F9] rounded-lg py-3 px-3 text-lg shadow-2xl"
        placeholder={placeholder}
        placeholderTextColor="#C4bfb6"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
      />
    </View>
  );
}
