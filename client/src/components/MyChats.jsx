import React, { useEffect, useState } from "react";
import { chatState } from "../context/chat.provider";
import { useToast, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Box, Stack, Text } from "@chakra-ui/react";
import { CHATSERVERENDPOINT, REACT_ROUTE } from "../../url";
import ChatLoading from "./miscellaneous/ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import io from "socket.io-client";
let socket;
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const {
    selectedChat,
    fetchAgain,
    setSelectedChat,
    user,
    chats,
    setChats,
    onlineUsers,
    setOnlineUsers,
  } = chatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const url = REACT_ROUTE;
      const response = await axios.get(`${url}/api/chat/`, config);
      response.data && setChats(response.data.data);
    } catch (error) {
      toast({
        title: "Error Ocuured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  useEffect(() => {
    socket = io.connect(CHATSERVERENDPOINT);
    socket.emit("onlinestatus", user.data._id);
  }, []);
  useEffect(() => {
    socket.on("onlinestatus", (users) => setOnlineUsers(users));
  });
  window.addEventListener("beforeunload", () => {
    socket.emit("offlinestatus", user.data._id);
  });
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={{ base: "flex" }}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            <AddIcon />
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg="F8F8F8"
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                {
                  <Text>
                    {!chat.isGroupChat
                      ? onlineUsers.includes(
                          getSender(loggedUser?.data._id, chat.users)._id
                        )
                        ? `${
                            getSender(loggedUser?.data._id, chat.users).name
                          } (Online)`
                        : getSender(loggedUser?.data._id, chat.users).name
                      : chat.chatName}
                  </Text>
                }
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
