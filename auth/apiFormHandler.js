import Forms from "../models/form.js";

const formHandler = async (req, res, next) => {
  try {
    const user = req.user;
    const key = req.user.api;
    if (!user.formRequested) {
      //Send the Form to Database
      const form = new Forms({
        ...req.body,
        user: user._id,
      });
      user.formRequested = true;
      await form.save();
      await user.save();
      res.status(208).send({ msg: "Your Form is Under Validation" });
    } else res.status(208).send({ msg: "Your Form is Under Validation" });
  } catch (E) {
    res.send({ Error: E });
  }
};
export default formHandler;
