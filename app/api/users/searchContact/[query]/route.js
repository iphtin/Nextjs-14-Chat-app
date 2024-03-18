import User from "@models/User";
import { connectToDB } from "@mongodb"

export const GET = async (req, { params }) => {
     try {

        await connectToDB();

        const { query } = params 

        const searchContact = await User.find({
            $or: [
                { username: {$regex: query, $options: "i"}},
                { email: {$regex: query, $options: "i"}},
            ]
        })

        return new Response(JSON.stringify(searchContact), {status: 200})

     } catch (error) {
        return new Response("Failed to Search Contacts with this User name", { status: 500});
     }
}