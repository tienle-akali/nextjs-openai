import { Delete, Send } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  GlobalStyles,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Toolbar,
} from "@mui/material";
import Head from "next/head";
import { Configuration, OpenAIApi } from "openai";
import { useEffect, useRef, useState } from "react";
import LayoutDashboard from "../components/LayoutDashboard";
import MenuSidebar from "../components/MenuSidebar";
import { routerMenu } from "../router/routerMenu";

const LINK_DOC = `https://platform.openai.com/docs/api-reference/chat/create`;
const BOT_AVATAR = `https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/800px-ChatGPT_logo.svg.png`;

// const OPENAI_API_KEY = "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";

const renderListItem = ({ id, isBot = false, messageText = "" }) => {
  return (
    <ListItem
      key={id}
      sx={(theme) => ({
        backgroundColor: isBot
          ? theme.palette.grey[900]
          : theme.palette.background.paper,
      })}
    >
      <ListItemAvatar sx={{ alignSelf: "flex-start" }}>
        <Avatar
          sx={(theme) => ({ borderRadius: theme.spacing(3, 3, 1, 3) })}
          variant="rounded"
          alt={isBot ? "Bot" : "You"}
          src={isBot ? BOT_AVATAR : undefined}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <span>{messageText}</span>
          </>
        }
      />
    </ListItem>
  );
};

export default function Chat() {
  //   console.log(process.env.OPENAI_API_KEY);
  const configuration = new Configuration({
    organization: "org-JCyZSYjfRaLDtltkimhxFO7j",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocusInput = () => {
    inputRef.current.focus();
  };

  const handleClearConversation = () => {
    setMessages([]);
    handleFocusInput();
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    setLoading(true);
    setInputValue("");
    const newMessages = [
      ...messages,
      { id: messages.length + 1, text: inputValue, author: "user" },
    ];

    setMessages(newMessages);

    try {
      event.preventDefault();
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputValue }],
      });
      console.log("response: ", response);
      const outputValue = response.data.choices[0].message.content;

      setMessages([
        ...newMessages,
        { id: messages.length + 2, text: outputValue, author: "bot" },
      ]);

      setLoading(false);
      handleFocusInput();
    } catch (error) {
      if (error.response) {
        console.log("status: ", error.response.status);
        console.log("data: ", error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
  }, [messages, loading]);

  return (
    <>
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <Head>
        <title>Chat GPT</title>
        <meta name="description" content="Connect chat GPT API" />
      </Head>
      <LayoutDashboard
        appbar="Chat GPT"
        sidebar={<MenuSidebar menu={routerMenu} />}
        mainContent={
          <Card
            elevation={0}
            sx={(theme) => ({
              height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
              display: "flex",
              flexDirection: "column",
            })}
          >
            <List
              id="chatbox"
              disablePadding
              sx={() => ({
                flex: 1,
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              })}
            >
              {messages.map((message) => {
                const isBot = message.author === "bot";

                return renderListItem({
                  id: message.id,
                  isBot,
                  messageText: message.text,
                });
              })}
              {loading &&
                renderListItem({
                  isBot: true,
                  messageText: <>is typing...</>,
                })}
            </List>
            <CardContent
              sx={{
                flex: "0 0 auto",
              }}
            >
              <Toolbar disableGutters sx={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleClearConversation}
                >
                  Clear conversation
                </Button>
              </Toolbar>
              <Card>
                <form onSubmit={handleSubmit}>
                  <TextField
                    inputRef={inputRef}
                    placeholder="Enter your message"
                    fullWidth
                    autoFocus
                    value={inputValue}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            color={loading ? "default" : "primary"}
                            disabled={loading}
                          >
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Card>
            </CardContent>
          </Card>
        }
      />
    </>
  );
}
