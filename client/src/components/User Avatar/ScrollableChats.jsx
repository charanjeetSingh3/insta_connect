import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { chatState } from "../../context/chat.provider";
import { Tooltip, Avatar } from "@chakra-ui/react";
const ScrollableChats = ({ messages }) => {
  const { user } = chatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div style={{ display: "flex" }} key={message._id}>
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user.data._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderBottomRightRadius: "15px",
                padding: "5px 15px",
                maxWidth: "75%",
                // alignSelf: isSameSenderMargin(
                //   messages,
                //   message,
                //   i,
                //   user.data._id
                // ),
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  i,
                  user.data._id
                ),
                marginTop: isSameUser(messages, message, i, user.data._id)
                  ? 3
                  : 10,
              }}
            >
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span>{message.content}</span>
                <span style={{ fontSize: "12px" }}>
                  {message.createdAt.split("T")[0] +
                    " " +
                    message.createdAt.split("T")[1].split(":")[0] +
                    " " +
                    message.createdAt.split("T")[1].split(":")[1]}
                </span>
              </span>
            </span>
            {isSameSender(messages, message, i, user.data._id) ||
              (isLastMessage(messages, i, user.data._id) && (
                <Tooltip
                  label={message.sender.name}
                  placements="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    ml={"7px"}
                    size={"sm"}
                    cursor={"pointer"}
                    name={message.sender.name}
                    src={message.sender.picture}
                  />
                </Tooltip>
              ))}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
