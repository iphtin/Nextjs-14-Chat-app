"use client";

import Loader from '@components/Loader';
import { PersonOutline } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const Profile = () => {
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
     if(user) {
        reset({
                username: user?.username,
                profileImage: user?.profileImage
        })
     }
         setLoading(false);
    }, [user])

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const uploadPhoto = (result) => {
        setValue("profileImage", result?.info?.secure_url);
    }

    const updatedUser = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${user?.id}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            setLoading(false);

            window.location.reload();
           
        } catch (error) {
            console.log(error);
        }
    }

  return loading ? <Loader /> : (
    <div className='profile-page'>
        <h1 className='font-bold text-[30px]'>Edit Your Profile</h1>
         
         <form className='edit-profile' onSubmit={handleSubmit(updatedUser)}>
        <div>
        <div className='input'>
        <input
         defaultValue=""
         {...register("username", {
             required: "Username is required", validate: (value) => {
                 if (value.length < 3) {
                     return "Username must at least 3 characters"
                 }
             }
         })}
         type='text' placeholder='username' className='input-field' />
        <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
         <p className="text-red-500">{errors.username.message}</p>
        )}
        </div>
        <div className='flex items-center justify-between'>
            <img 
            className="w-40 h-40 rounded-full"
            src={watch("profileImage") || user?.profileImage || "/assets/person.jpg"} alt="profileImage" />
            <CldUploadButton options={{maxFiles: 1}} onUpload={uploadPhoto} uploadPreset='uewxgvm2'>
            <p className="text-body-bold">Upload New Photo</p>
            </CldUploadButton>
         </div>

         <button className='btn' type="submit">Save Changes</button>
         </form>
    </div>
  )
}

export default Profile;