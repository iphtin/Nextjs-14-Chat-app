"use client";

import { Logout } from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TopBar = () => {

  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  }
  return (
    <div className='topbar'>
      <div className='flex items-center'>
      <img src='/assets/logo.png' alt="logo" className='w-[30px] h-[30px]' />
       <h2 className='ml-2 font-bold'>Iphtin Chat</h2>
      </div>

      <div className='menu'>
        
        <Link href="/chats" className={`${pathname === "/chats" ? "text-red-1" : ""} font-bold`}>Chats</Link>

        <Link href="/contacts" className={`${pathname === "/contacts" ? "text-red-1" : ""} font-bold`}>Contacts</Link>
        
        <Logout
         onClick={handleLogout}
         sx={{ color: "#737373", cursor: "pointer"}}/>

       <Link href="/profile">
       <img src={user?.profileImage || "/assets/person.jpg"}
       className='profilePhoto' 
       alt='profileImage' />
       </Link>   

      </div>
    </div>
  )
}

export default TopBar