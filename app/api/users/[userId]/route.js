import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb"

export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const {userId} = params;

        console.log(userId);

        const allChats = await Chat.find({ members: userId })
        .sort({ lastMessageAt: -1 })
        .populate({
            path: "members",
            model: User,
        })  
        .populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User,
            }
        }) 
          .exec();

        console.log("ALL CHATS", allChats);

        return new Response(JSON.stringify(allChats), {status: 200});

    } catch (error) {
        console.log(error.message);
       return new Response("Failed to get User List", { status: 500})
    }

}