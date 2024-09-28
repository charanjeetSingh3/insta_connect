// to show the name in list of the senders in one to one chat
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1] : users[0];
};
// to show the name of the person with whom the chatwindow is opened
export const getChatPerson = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1].name : users[0].name;
};
// To show the details of the logged in user in the chat window
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1] : users[0];
};
// All messages, current message, index of current message, logged in user id

export const isSameSender = (messages, m, i, userId) => {
  i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId;
};
// To show the profile image against the last message send by the opposite message sender
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
// to alogn the text messages with the respective senders
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (messages[i].sender._id == userId) {
    return "auto";
  } else {
    return 0;
  }
  // if (
  //   i < messages.length - 1 &&
  //   messages[i + 1].sender._id === m.sender._id &&
  //   messages[i].sender._id !== userId
  // ) {
  //   return "33rem";
  // } else if (
  //   (i < messages.length - 1 &&
  //     messages[i + 1].sender._id !== m.sender._id &&
  //     messages[i].sender._id !== userId) ||
  //   (i === messages.length - 1 && messages[i].sender._id !== userId)
  // ) {
  //   return 0;
  // } else {
  //   return "auto";
  // }
};
// to give the space between the messages of the same senders
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
