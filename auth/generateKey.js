import jwt from "jsonwebtoken";

import Users from "../models/adminModels.js";
import Forms from "../models/form.js";
import apiCounts from "../models/apiModels.js";

const gen = async (req, res, next) => {
  //Check if user is authenticated or not.
  const user = req.user;
  const key = req.user.apiKey;

  if (!key && !user.formRequested && !user.formAccepted) {
    console.log("Inside the Form");
    //Send the Form to Database
    const form = new Forms(req.body);
    user.formRequested = true;

    await form.save();
    await user.save();

    res.status(208).send({
      msg: "Your Form is Under Validation",
    });
  } else if (!key && !user.formAccepted) {
    console.log("inside validation");
    res.status(403).send({
      error: "Form Under Validation Please Wait for about one eternity",
    });
  }

  if (!key && user.formAccepted) {
    const generated_key = await user.generateAPIKEY();
    const api = new apiCounts({ ApiKey: generated_key });
    await api.save();
    //Send Through Headers APIKEY
    console.log(`API KEY : ${generated_key}`);
  }
  if (key && user.formAccepted && user.formRequested) {
    res.status(200).send({
      user: user.toJSON(),
      apikey: user.apiKey,
    });
  }
};

// const token_from_browser = req.header('Cookie').replace("SKey=Bearer ", "");
// //Find User By Token
//    const allUser = await Users.find({ "tokens.token": token_from_browser });
//    const user = allUser[0].toObject();
//    console.log(user.formRequested, user.formAccepted)
//    // Check if the credientials provided by user match with credentails in database???
//    const key = user.apiKey;
//    if (!key && !user.formRequested && !user.formAccepted) {
//       console.log("Inside the Form")
//       //Send the Form to Database
//       const form = new Forms(req.body);
//       await form.save()
//       Users.updateOne({
//          "tokens.token": token_from_browser
//       }, {
//          formRequested: true
//       })
//       res.status(208).send({
//          "msg": "Under Validation"
//       })

//    }
//    if (!user.apiKey && user.formRequested) {
//       console.log("inside validation")
//       res.status(403).send({
//          error: "Form Under Validation Please Wait"
//       })
//    }
//    //user.apiKey is property and property of null cannot be read
//    if (!user.apiKey && user.formAccepted == true) {
//       //Generate an API Key here and store in database
//       const generated_key = await allUser[0].generateAPIKEY();
//       //Send Through Headers APIKEY
//       console.log(generated_key)
//    }

//  const akey =  user.getAPIKEY();
//  form.deleteOne(form)

export default gen;
