import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react'

const ChatBox = ({ chat, currentUser, currentChatId }) => {
  const router = useRouter();

  const otherMembers = chat?.members.filter((member) => member._id !== currentUser._id);

  const lastMessage = chat?.messages.length > 0 && chat?.messages[chat?.messages.length - 1];

  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  return (
    <div className={`chech-box ${chat?._id === currentChatId ? "bg-blue-2 p-1 mb-2 rounded" : ""}`} onClick={() => router.push(`/chats/${chat?._id}`)}>
      <div className='chat-info mb-3'>
        {chat?.isGroup ? (
          <img
            className='profilePhoto'
            src={chat?.groupPhoto || "/assets/group.png"} alt='groupPhoto' />
        ) : (
          <img
            className='profilePhoto'
            src={otherMembers[0].profileImage || "/assets/person.jpg"} alt="profilePhot" />
        )}

        <div className='flex gap-1 justify-between w-[100%]'>
          <div className='flex flex-col gap-1'>
            {chat?.isGroup ? (
              <p className="text-base-bold">{chat?.name}</p>
            ) : (
              <p className='text-base-bold'>{otherMembers[0].username}</p>
            )}

            {!lastMessage && (
              <p className='text-small-bold'>Start a chat</p>
            )}

            {lastMessage?.photo ? (
              lastMessage?.sender?._id === currentUser._id ? (
                <p className='text-small-medium text-grey-3'>You send a photo</p>
              ): (
                <p className={`${seen ? "text-small-medium text-grey-3" : "text-small-bold" }`}>received a photo</p>
              )    
            ) : (
              <p className={`last-message ${seen ? "text-small-medium text-grey-3" : "text-small-bold" }`}>
                {lastMessage?.text}
              </p>
            )}

          </div>

          <div>
            <p className='text-base-light text-[11px] text-grey-3'>
              {!lastMessage ? format(new Date(chat?.createdAt), "p") : format(new Date(chat?.lastMessageAt), "p")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox