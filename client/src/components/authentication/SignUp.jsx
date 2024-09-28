import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  VStack,
  InputGroup,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_ROUTE } from "../../../url";
const SignUp = () => {
  const history = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setProfilePic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleShowClick = () => {
    setShow(!show);
  };
  const submitSignUpHandler = async () => {
    setLoading(true);
    if (!name || !email || !password | !confirmPassword || picture === "") {
      toast({
        title: "Please fill all the required fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password and Confirm password should be same..",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const url = REACT_ROUTE;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${url}/api/user/create`,
        { name, email, password, picture },
        config
      );
      toast({
        title: "Registration successful.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occurred.",
        // description: err.response, // Displaying the error message
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const postDetails = async (pics) => {
    try {
      setLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please select an image.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chattar_pattar");
        data.append("cloud_name", "dhiohuf2c");

        fetch("https://api.cloudinary.com/v1_1/dhiohuf2c/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("dw,jkqbdjqwbjd", data)
            setProfilePic(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            console.error(err.message);
            setLoading(false);
          });
      } else {
        toast({
          title: "Please select JPEG/ PNG image.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Error while uploading the image", err);
    }
  };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              p="0.25rem"
              bg="white"
              mr="1rem"
              size="sm"
              onClick={handleShowClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Re-enter Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button
              h="1.75rem"
              p="0.25rem"
              bg="white"
              mr="1rem"
              size="sm"
              onClick={handleShowClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p="1.5"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        mt="1.5rem"
        onClick={submitSignUpHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
