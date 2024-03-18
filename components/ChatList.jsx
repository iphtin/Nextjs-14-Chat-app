"use client";

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Loader from './Loader';
import ChatBox from './ChatBox';
import { pusherClient } from '@lib/pusher';

const ChatList = ({ currentChatId }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const [search, setSearch] = useState("")

  const currentUser = session?.user;
  console.log("CurrentUser From ChatList", currentUser);

  const getChats = async () => {
     try {
       const res = await fetch(search !== "" ? `/api/users/${currentUser._id}/searchChat/${search}` : `/api/users/${currentUser._id}`);
       const data = await res.json();
       setChats(data);
       setLoading(false);
     } catch (error) {
       console.log(error)
     }
  }

  useEffect(() => {
     if(currentUser) {
      getChats();
     }
  }, [currentUser, search])

  useEffect(() => {
      if(currentUser) {
        pusherClient.subscribe(currentUser._id)

        const handleChatUpdate = (updatedChat) => {
          setChats((allChats) =>
            allChats.map((chat) => {
              if (chat._id === updatedChat.id) {
                return { ...chat, messages: updatedChat.messages };
              } else {
                return chat;
              }
            })
          );
        };

        const handleNewChat = (newChat) => {
          setChats((allChats) => [...allChats, newChat])
        }

        pusherClient.bind("update-chat", handleChatUpdate);
        pusherClient.bind("new-chat", handleNewChat)
        
        return () => {
          pusherClient.unsubscribe(currentUser._id);
          pusherClient.unbind("update-chat", handleChatUpdate);
          pusherClient.unbind("new-chat", handleNewChat)
        }

      }
  }, [currentUser])

  return loading ? <Loader /> : (
    <div className='chat-list'>
      <input type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder='Search Chat....' className='input-search' />

      <div className='chats'>
      {chats?.map((chat, index)=> (
        <ChatBox chat={chat} key={index}
        currentChatId={currentChatId}
         currentUser={currentUser}  />
      ))}
      </div>
    </div>
  )
}

export default ChatList