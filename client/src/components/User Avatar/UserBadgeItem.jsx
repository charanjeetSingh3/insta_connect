import React from "react";
import { chatState } from "../../context/chat.provider";
import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variants="solid"
      fontSize="12px"
      color="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={5} />
    </Box>
  );
};

export default UserBadgeItem;
