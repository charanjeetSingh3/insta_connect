import React from "react";
import { chatState } from "../context/chat.provider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
const ChatBox = () => {
  const { selectedChat } = chatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      overflow={"scroll"}
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
