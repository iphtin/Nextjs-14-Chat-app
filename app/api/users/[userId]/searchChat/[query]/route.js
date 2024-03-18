import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb"

export const GET = async (req, { params}) => {
     try {
       await connectToDB();

       const { userId, query } = params

       const searchChat = await Chat.find({
        members: userId,
        name: {$regex: query, $options: 'i'},

       }).populate({
        path: "members",
        model: User
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

       return new Response(JSON.stringify(searchChat), { status: 200 })
     } catch (error) {
        return new Response("Failed to Search chat", { status: 500})
     }
}