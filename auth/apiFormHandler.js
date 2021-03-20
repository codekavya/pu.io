import Forms from "../models/form.js";

const formHandler = async (req, res, next) => {
  //Check if user is authenticated or not.
  const user = req.user;
  const key = req.user.apiKey;

  if (!user.formRequested) {
    //Send the Form to Database
    const form = new Forms({...req.body,userName:user.Name,userID:user._id.toString()});
    user.formRequested = true;
    await form.save();
    await user.save();

    res.status(208).send({
      msg: "Your Form is Under Validation",
    });
  } else {
        res.redirect('/key');
    };
  }

  

export default formHandler;
