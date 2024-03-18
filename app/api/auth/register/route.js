import User from "@models/User";
import { connectToDB } from "@mongodb";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
    try {
        await connectToDB();

        const body = await req.json();
        
        const { username, email, password } = body;

        console.log(username, email, password);

        const existingUser = await User.findOne({ email})

        if(existingUser) {
            return new Response("User Already Exist", { status: 400 });
        }

        const hashPassword = await hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
        })

        await newUser.save();

        return new Response(JSON.stringify(newUser), { status: 200})

    } catch (error) {
        console.log(error);
        return new Response("Failed to Create a new User");

    }
}