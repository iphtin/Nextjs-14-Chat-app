"use client";

import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signIn } from "next-auth/react"

const Form = ({ type }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const router = useRouter();

    const onSubmit = async (data) => {
        if( type === "register") {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });

            if(res.ok) {
               router.push("/");
            }

            if(res.error) {
                toast.error("Something Went Wrong!")
            }
        }

        if(type === "login") {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
              })

              console.log(res)

              if (res.ok) {
                router.push("/chats");
              }
        
              if (res.error) {
                toast.error("Invalid email or password");
              }

        }
    }

    return (
        <div className='auth'>
            <div className='content'>
                <div className='flex items-center'>
                    <img src='/assets/logo.png' alt='logo' className='w-[60px] h-[60px]' />
                    <h1 className='ml-2 font-bold text-[20px]'>Iphtin Chat</h1>
                </div>

                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    {type === "register" && (
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
                                type="text"
                                placeholder='username' className='input-field' />
                            <PersonOutline sx={{ color: "#737373" }} />
                        </div>
                        {errors.username && (
                   <p className="text-red-500">{errors.username.message}</p>
                        )}
                        </div>
                    )}
                   <div>
                    <div className='input'>
                        <input defaultValue="" {...register("email", { required: "E-mail is required" })} type="email" placeholder='E-mail' className='input-field' />
                        <EmailOutlined sx={{ color: "#737373" }} />
                    </div>
                    {errors.email && (
                   <p className="text-red-500">{errors.email.message}</p>
                        )}
                   </div>
                    <div>
                    <div className='input'>
                        <input
                        defaultValue=""
                            {...register("password", {
                                required: "Password is required", validate: (value) => {
                                    if (
                                        value.length < 5 ||
                                        !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                                    ) {
                                        return "Password must be at least 5 characters and contain at least one special character";
                                    }
                                }
                            })}
                            type="password" placeholder='Password' className='input-field' />
                        <LockOutlined sx={{ color: "#737373" }} />
                    </div>
                    {errors.password && (
                   <p className="text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <button className='button' type='submit'>
                        {type === "register" ? "Join free" : "Let's chat"}
                    </button>

                </form>

                {type === "register" ? (
                    <Link href="/" className='link'>
                        <p className='text-center'>Already have an account? Sign In Here</p>
                    </Link>
                ) : (
                    <Link href="/register" className='link'>
                        <p className='text-center'>Don't have an account ? Register Here</p>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Form;