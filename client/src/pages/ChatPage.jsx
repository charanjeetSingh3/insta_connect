import { chatState } from "../context/chat.provider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MyChats from "../components/MyChats.jsx";
import ChatBox from "../components/ChatBox.jsx";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setUser } = chatState();
  const history = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      history("/");
    }
  }, [history]);
  return (
    <div style={{ width: "100%", backgroundColor: "white" }}>
      {user && <SideDrawer />}
      <Box display="flex" h="88vh">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
