import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { chatState } from "../../context/chat.provider";
import {
  Avatar,
  Tooltip,
  Button,
  Text,
  Spinner,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import io from "socket.io-client";
import UserListItem from "../User Avatar/UserListItem.jsx";
import ChatLoading from "./ChatLoading.jsx";
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CHATSERVERENDPOINT, REACT_ROUTE } from "../../../url.js";
import { getSender } from "../../config/ChatLogics.js";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
let socket;
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useNavigate();
  const [search, setSearch] = useState("");
  const [searchedResult, setSearchedResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    selectedChat,
    notification,
    setNotification,
  } = chatState();
  const toast = useToast();
  const logoutHandler = () => {
    socket = io.connect(CHATSERVERENDPOINT);
    socket.emit("offlinestatus", user.data._id);
    localStorage.removeItem("userInfo");
    history("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const url = REACT_ROUTE;
      const { data } = await axios.get(
        `${url}/api/user/all?search=${search}`,
        config
      );
      setLoading(false);
      setSearchedResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const url = REACT_ROUTE;
      const { data } = await axios.post(`${url}/api/chat/`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        const d = data.data;
        setChats([d, ...chats]);
      }
      setSelectedChat(data.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        status: error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"4xl"}>INSTA CONNECT</Text>
        <div>
          <Menu>
            <MenuButton p={1} fontSize="2xl">
              <div></div>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />  */}
              <BellIcon m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(notification.filter((not) => not !== noti));
                  }}
                >
                  {noti.chat.isGroupChat
                    ? `New message in ${noti.chat.chatName}`
                    : `New message in ${
                        getSender(user._id, noti.chat.users).name
                      }`}
                </MenuItem>
              ))}
            </MenuList>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.data.name}
                  src={user.data.picture}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user.data}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchedResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex"></Spinner>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
