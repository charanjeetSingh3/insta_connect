import { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <ChatContext.Provider
      value={{
        user,
        chats,
        notification,
        selectedChat,
        fetchAgain,
        onlineUsers,
        setUser,
        setSelectedChat,
        setNotification,
        setChats,
        setFetchAgain,
        setOnlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const chatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
