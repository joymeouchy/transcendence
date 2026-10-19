"use client";

import { useEffect, useRef, useState } from "react";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import FriendsListPanel from "../../Friends/FriendListPanel/FriendListPanel";
import ChatPanel from "../../chat/ChatPanel/ChatPanel";

import { Friend, UserProfile } from "@/types/types.dto";

import clsx from "clsx";
import styles from "./ChatsPageTemplate.module.scss";
import { Message } from "@/types/messages";
import { MessagesService } from "@/services/messages.services";
import useMessageSocket from "../UseMessagesSocket";

interface Props {
  user?: UserProfile;
  friends: Friend[];

  loading?: boolean;

  onClose?: () => void;
}

export default function ChatsPageTemplate({
  user,
  friends,
  loading = false,
  onClose,
}: Props) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  // phones show one pane at a time: the friends list, then the open chat
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const { receivedMessage } = useMessageSocket();
  const lastProcessedMessageId = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedFriend && friends.length > 0) {
      setSelectedFriend(friends[0]);
    }
  }, [friends, selectedFriend]);
  useEffect(() => {
    if (!selectedFriend) return;

    const friendId = selectedFriend.id;

    async function loadMessages() {
      setMessagesLoading(true);

      try {
        const messagesData = await MessagesService.getMessages(friendId);

        setMessages(messagesData);
      } catch (error) {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    }

    loadMessages();
  }, [selectedFriend]);

  useEffect(() => {
    if (!receivedMessage) return;

    // Ignore messages we've already processed
    if (lastProcessedMessageId.current === receivedMessage.id) {
      return;
    }

    lastProcessedMessageId.current = receivedMessage.id;

    // Ignore messages sent by the current user
    if (receivedMessage.senderId === user?.id) {
      return;
    }

    // Message belongs to the currently open chat
    if (selectedFriend?.id === receivedMessage.senderId) {
      setMessages((prev) => {
        // Prevent duplicate messages in the chat
        if (prev.some((message) => message.id === receivedMessage.id)) {
          return prev;
        }

        return [...prev, receivedMessage];
      });

      return;
    }

    // Message belongs to another chat
    setUnreadCounts((prev) => ({
      ...prev,
      [receivedMessage.senderId]: (prev[receivedMessage.senderId] || 0) + 1,
    }));
  }, [receivedMessage, selectedFriend?.id, user?.id]);

  function handleSelectFriend(friend: Friend) {
    setSelectedFriend(friend);
    setMobileChatOpen(true);

    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[friend.id];
      return updated;
    });
  }

  
  async function handleSendMessage(content: string) {
    if (!user) return;
    if (!selectedFriend) return;

    const tempMessage: Message = {
      id: Date.now(),
      senderId: user.id,
      receiverId: selectedFriend.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await MessagesService.sendMessage(selectedFriend.id, content);
    } catch (error) {

      setMessages((prev) =>
        prev.filter((message) => message.id !== tempMessage.id)
      );
    }
  }
  return (
    <DesktopLayout>
      <XPWindow
        title="MSN"
        onClose={onClose}
        isLoading={loading}
        loadingMessage="Loading chats..."
      >
        <div className="flex h-100 w-150 max-w-full gap-2.5 overflow-hidden p-1.25 font-xp max-[600px]:h-[70dvh] max-[600px]:min-h-87.5 max-[600px]:w-full">
          <div className={clsx("h-full w-50 shrink-0 max-[600px]:w-full", mobileChatOpen && "max-[600px]:hidden")}>
            <FriendsListPanel
              friends={friends}
              selectedFriendId={selectedFriend?.id}
              onSelectFriend={handleSelectFriend}
              unreadCounts={unreadCounts}
            />
          </div>

          <div
            className={clsx(
              styles.chatPanel,
              "h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-xp-sm bg-xp-window-bg",
              !mobileChatOpen && "max-[600px]:hidden",
            )}
          >
            {selectedFriend ? (
              <ChatPanel
                user={selectedFriend}
                currentUserId={user?.id ?? 0}
                messages={messages}
                messagesLoading={messagesLoading}
                onSendMessage={handleSendMessage}
                onBack={() => setMobileChatOpen(false)}
              />
            ) : (
              <div>
                Select a friend to start chatting
              </div>
            )}
          </div>
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
