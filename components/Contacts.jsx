"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'
import Loader from './Loader';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const Contacts = () => {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const { data: session } = useSession();
    const currentUser = session?.user;

    const getContacts = async () => {
        try {
            const res = await fetch(search !== "" ? `/api/users/searchContact/${search}` : "/api/users");
            const data = await res.json();
            setContacts(data.filter((contact) => contact._id !== currentUser._id));
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (currentUser) {
            getContacts();
        }
    }, [currentUser, search])

    // Selected Contacts

    const [selectedContacts, setSelectedContacts] = useState([]);

    const isGroup = selectedContacts.length > 1;

    const handleSelected = (contact) => {
        if (selectedContacts.includes(contact)) {
            setSelectedContacts((prevSelected) => prevSelected.filter(item => item !== contact))
        } else {
            setSelectedContacts((prevSelected) => [...prevSelected, contact])
        }
    }

    // Add Group Chat Name 

    const [name, setName] = useState("");

    // create Chat

    const createChat = async () => {
        const res = await fetch("/api/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              currentUserId: currentUser._id,
              members: selectedContacts.map((contact) => contact._id),
              isGroup,
              name,
            }),
          });
          const chat = await res.json();

          console.log("Chat", chat)
      
          if (res.ok) {
            router.push(`/chats/${chat._id}`);
          }
    }


    return loading ? <Loader /> : (
        <div className='create-chat-container'>
            <input type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search Contact....'
                className='input-search' />

            <div className="contact-bar">
                <div className="contact-list">
                    <p className='text-body-bold'>Select or Delesect</p>
                    {contacts.map((user, index) => (
                        <div key={index} className="contact" onClick={() => {handleSelected(user)}}>
                            {selectedContacts.find((item) => item === user) ? (
                                <CheckCircle sx={{color: "red"}} />
                            ) : (
                                <RadioButtonUnchecked />
                            )} 
                            <img src={user.profileImage || "/assets/person.jpg"}
                                className='profilePhoto'
                                alt='userprofile' />
                            <p className='text-base-bold'>{user.username}</p>
                        </div>
                    ))}
                </div>
                <div className='create-chat'>
                    {isGroup && (
                        <>
                            <div className='flex flex-col gap-3'>
                                <p className="text-body-bold">Group Chat Name</p>
                                <input type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='input-group-name'
                                    placeholder='Enter group  chat name' />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <p className='text-body-bold'>Members</p>
                                <div className='flex flex-wrap gap-3'>
                                    {selectedContacts.map((contact, index) => (
                                        <p className='selected-contact' key={index}>
                                            {contact.username}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <button className='btn' onClick={createChat}>Start A New Chat</button>
                </div>
            </div>
        </div>
    )
}

export default Contacts