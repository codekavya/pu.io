const users = []

const storeUsers = ({
    id,
    username,
    room
}) => {

    // Store user
    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return {
        user
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const findBy = (id) => {
    return users.find((user) => user.id === id)
}

const findall = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}
export {
    storeUsers,
    removeUser,
    findBy,
    findall
}