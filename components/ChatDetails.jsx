"use client";

import { useEffect, useRef, useState } from 'react'
import Loader from './Loader';
import Link from 'next/link';
import { AddPhotoAlternate } from '@mui/icons-material';
import { CldUploadButton } from 'next-cloudinary';
import MessageBox from './MessageBox';
import { pusherClient } from '@lib/pusher';

const ChatDetails = ({chatId, currentUser}) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState([]);
  const [otherMembers, setOtherMembers] = useState([]);
  const [text,setText] = useState("");


  const getChatDetail = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setOtherMembers(data?.members?.filter(member => member._id !== currentUser._id));
      setChat(data);
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
      if(currentUser && chatId) {
         getChatDetail();
      }
  }, [currentUser,chatId])


  const sendText = async () => {
    try {
       const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text
        })
       })

       if(res.ok) {
         setText("");
       }

    } catch (error) {
      cosnole.log(error)
    }
  }

  const sendPhoto = async (result) => {
     try {
       const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url
        })
       })
     } catch (error) {
      console.log(error)
     }
  }


  useEffect(() => {
     pusherClient.subscribe(chatId)

     const handleMessage = async (newMessage)  => {
        setChat((prevChat) => {
          return {
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
          }
        })
     }

     pusherClient.bind("new-message", handleMessage);

     return () => {
       pusherClient.unsubscribe(chatId);
       pusherClient.unbind("new-message", handleMessage)
     }

  }, [chatId]);

  // scroll down to the bottom when you have new message

  const bottomRef = useRef(null);

  useEffect(() => {
       bottomRef.current?.scrollIntoView({
        behavior: "smooth",
       })
  }, [chat?.messages])

  return loading ? <Loader /> : (
    <div className="pb-20">
    <div className="chat-details">
      <div className='chat-header'>
        {chat?.isGroup ? (
          <>
         <Link href={`/chats/${chatId}/group-info`}>
          <img src={chat?.groupPhoto || "/assets/group.png"} 
          className='profilePhoto'
          alt="groupPhoto" />
            </Link>
          <div className='text'>
            <p className=''>{chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                  members </p>
          </div>       
          </>
        ) : (
          <>
         <img src={otherMembers[0].profileImage || "/assets/person.jpg"}
         className='profilePhoto' 
         alt="profileImage" />
         <div>
          <p>{otherMembers[0].username}</p>
         </div>
          </>
        )}
      </div>

    <div className='chat-body'>
      {chat?.messages?.map((message, index) => (
        <MessageBox 
        message={message} 
        key={index}
        currentUser={currentUser} />
      ))}
      <div ref={bottomRef} />
    </div>

    <div className='send-message'>
     <div className='prepare-message w-full'>
     <CldUploadButton options={{maxFiles: 1}} onUpload={sendPhoto} uploadPreset='uewxgvm2'>
     <AddPhotoAlternate sx={{ fontSize: "35px", color: "#737373", cursor: "pointer", "&:hover": {color: "red"}}} />
     </CldUploadButton>
     <input typ="text" 
     className='w-full outline-none'
     value={text}
     onChange={(e) => setText(e.target.value)}
     placeholder='Send Message'
     required
      />
    <div onClick={sendText}>
      <img src="/assets/send.jpg" alt="send" className='send-icon' />
    </div>
     </div>
    </div>
    </div>
    </div>
  )
}

export default ChatDetails