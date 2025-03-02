import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";

const QueryBot = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am the Postie Query Bot. How can I help you?",
      role: "bot",
    },
  ]);
  const [query, setQuery] = useState(""); // State for user input

  const [fontsLoaded] = useFonts({
    RobotoBold: require("../../../assets/fonts/Roboto-Bold.ttf"),
    RobotoRegular: require("../../../assets/fonts/Roboto-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  // Handle sending message and fetching bot response
  const handleSend = async () => {
    if (query.trim()) {
      // Add the user's query to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: query, role: "human" },
      ]);

      setQuery(""); // Clear the input field

      try {
        console.log("Sending query:", query); // Debugging line

        // Send the query in the expected format
        const response = await fetch(
          "https://api-query-bot.onrender.com/query",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: query }), // Send query as "question"
          },
        );

        // Parse the response body as JSON
        const data = await response.json();

        // Check if the response was successful
        if (response.ok) {
          // Assuming the response contains an 'answer' field with the bot's reply
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: data.answer, role: "bot" }, // Use 'answer' field from the response
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message:
                "Sorry, I am only designed to process Indian Posts related query.",
              role: "bot",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: "Something went wrong. Please try again later.",
            role: "bot",
          },
        ]);
      }
    }
  };

  // Show loading text until fonts are loaded
  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View></View>
      {/* Chat Messages */}
      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        {messages.map((item, index) => (
          <View
            key={index}
            style={{
              alignSelf: item.role === "human" ? "flex-end" : "flex-start",
              backgroundColor: item.role === "human" ? "#D1E8FF" : "#0c88fc",
              borderRadius: 12,
              marginVertical: 8,
              padding: 8,
              maxWidth: "80%",
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: item.role === "human" ? "#000" : "white",
              }}
            >
              {item.message}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Field */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            flex: 1,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 15,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 8,
            backgroundColor: "white",
          }}
        >
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Enter your query"
            style={{ fontFamily: "PoppinsRegular" }}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          style={{
            backgroundColor: "#CD3431",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PoppinsRegular",
              fontSize: 16,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QueryBot;
