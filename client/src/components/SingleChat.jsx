import React, { useEffect, useState } from "react";
import { chatState } from "../context/chat.provider";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
import {
  IconButton,
  Input,
  FormControl,
  Box,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getChatPerson, getSenderFull } from "../config/ChatLogics";
import ProfilemModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { CHATSERVERENDPOINT, REACT_ROUTE } from "../../url";
import styles from "./styles.module.css";
import ScrollableChats from "./User Avatar/ScrollableChats";
let socket, selectedChatCompare;
const SingleChat = () => {
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setFetchAgain,
    fetchAgain,
  } = chatState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      setLoading(true);
      const url = REACT_ROUTE;

      const { data } = await axios.get(
        `${url}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data.data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Ocuured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    socket = io.connect(CHATSERVERENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage != "") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        setNewMessage("");
        const url = REACT_ROUTE;
        const { data } = await axios.post(
          `${url}/api/message/`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data.data);
        setMessages([...messages, data.data]);
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
    }
  };
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getChatPerson(user.data?._id, selectedChat.users)}{" "}
                {/* <ProfilemModal
                user={getSenderFull(loggedUser?.data._id, selectedChat.users)}
                /> */}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className={styles.message}>
                <ScrollableChats messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  typing...
                  {/* <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginLeft: 0, marginBottom: 15 }} */}
                  {/* > */}
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg={"white"}
                autoFocus
                placeholder="Enter a message and press enter to send"
                onChange={typingHandler}
                value={newMessage}
                border={"1px solid black"}
                outline={"none"}
                _hover={{ border: "1px solid black" }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems={"center"} h="100%">
          <Text fontSize={"3xl"} pb={3}>
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
