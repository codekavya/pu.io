const user = req.body.user

const  specificPerson = async (field) => (req,res,next)=>{
    const user = req.user.populate(`${field}`)

}
