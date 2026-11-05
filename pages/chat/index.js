import { Delete, Send } from "@mui/icons-material";
import {
  Alert,
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
import { useEffect, useRef, useState } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import MenuSidebar from "../../components/MenuSidebar";
import { appInfo } from "../../config/info";
import { routerMenu } from "../../config/routerMenu";

// const LINK_DOC = `https://platform.openai.com/docs/api-reference/chat/create`;
const BOT_AVATAR = appInfo.logo;

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
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const chatboxRef = useRef(null);
  const requestIdRef = useRef(0);
  const requestInFlightRef = useRef(false);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleClearConversation = () => {
    requestIdRef.current += 1;
    requestInFlightRef.current = false;
    setMessages([]);
    handleFocusInput();
    setLoading(false);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || requestInFlightRef.current) {
      return;
    }

    requestInFlightRef.current = true;
    const requestId = ++requestIdRef.current;
    const newMessages = [
      ...messages,
      { id: messages.length + 1, text, author: "user" },
    ];

    setInputValue("");
    setMessages(newMessages);
    setError(null);

    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ text: messageText, author }) => ({
            role: author === "bot" ? "assistant" : "user",
            content: messageText,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create chat completion");
      }

      if (requestId !== requestIdRef.current) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: newMessages.length + 1,
          text: data.message,
          author: "bot",
        },
      ]);
      handleFocusInput();
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setError(error?.message || "An error occurred. Please try again.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        requestInFlightRef.current = false;
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <>
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <Head>
        <title>{appInfo.name}</title>
        <meta name="description" content={appInfo.description} />
      </Head>
      <LayoutDashboard
        appbar={appInfo.name}
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
              ref={chatboxRef}
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
              {error && (
                <ListItem>
                  <ListItemText>
                    <Alert severity="error">{error}</Alert>
                  </ListItemText>
                </ListItem>
              )}
            </List>
            <CardContent
              sx={{
                flex: "0 0 auto",
              }}
            >
              {messages.length > 0 && (
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
              )}
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
