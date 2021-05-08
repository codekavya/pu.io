import chatRoomModel from "../models/chatRoomModel.js";
const checkMember = async function(req, res, next) {
    try {
        //find the chatRoom through id
        const chatRoom = await chatRoomModel.findById(req.query.id);
        //pass chatRoom object and members
        req.chatRoom = chatRoom;
        const members = chatRoom.RoomMembers;
        const uid = req.user._id;

        //check if the logged user is the room member or not
        const istrue = members.includes(uid);
        /*if is then move to next middleware else
            send response of 401 unauthorized
            */

        istrue
            ?
            next() :
            res
            .status(403)
            .send({ Error: "Page broken not found thumbs with bandage" });
    } catch (error) {
        return res.status(401).send({
            Error: error,
            evaluated: "No such Room exists",
        });
    }
};

export default checkMember;