
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


////////////////// get register ////////////////////
module.exports.get_register = async (req, res) => {
    res.send("This is the register page");

}


///////////////// post register ////////////////////
module.exports.post_register = async (req, res) => {
    try {
        const isAlreadyEmail = await userModel.findOne({ email: req.body.email });
        const isAlreadyUsername = await userModel.findOne({ username: req.body.username });

        if (isAlreadyEmail || isAlreadyUsername) {
            if (isAlreadyEmail) {
                res.json({ msg: "User already registered with this email !!" });
            } else {
                res.json({ msg: "User already registered with this username !!" });
            }

        }
        else {
            const salt = await bcrypt.genSalt();

            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const saveUser = new userModel({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });

            const registerUser = await saveUser.save();

            if (registerUser) {
                res.status(200).json({msg : "User registered Successfully",registerUser:registerUser});
            }
            else {
                res.json({ msg: "user not registed, something wents wrong !!" });
            }
        }
    }

    catch (error) {
        res.json({ msg: error.message });
    }

}



///////////////// get login /////////////////////
module.exports.get_login = async (req, res) => {
    res.send("This is the login page");

}



////////////////// post login ////////////////////
module.exports.post_login = async (req, res) => {
    try {
        const isEmail = await userModel.findOne({ email: req.body.email });

        if (isEmail) {

            const isPasswordMatched = await bcrypt.compare(req.body.password, isEmail.password);

            if (isPasswordMatched) {
                // generate the jwt token
                const token = jwt.sign({ _id: isEmail._id }, process.env.SECRET_KEY);

                if (token) {

                    res.status(200).json({ msg: "User Login Successfully", token: token, user: isEmail });

                }
                else {
                    res.json({ msg: "Something wents wrong" });
                }
            }
            else {
                res.json({ msg: "Password does not match" })
            }

        }
        else {
            res.json({ msg: "Email not found" });
        }
    }
    catch (error) {
        res.json({ msg: error.message });
    }
}





// check user
module.exports.check_user = async (req, res) => {
    try {

        if (req.body.token) {
            const token = req.body.token;

            // verify token
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

            if (verifyToken) {
                res.status(200).json({ msg: "User is verified", isAuth: true });
            }
            else {
                res.json({ msg: "user is not Genuien !!", isAuth: false })
            }

        }
        else {
            res.json({ msg: "Token not found" });
        }
    }
    catch (error) {
        res.json({ msg: error, isAuth: false });
    }
}






// get active user
module.exports.get_active_user_by_token = async (req, res) => {

    if (req.body.token) {
        const token = req.body.token;

        // verify token
        const verifyTOken = jwt.verify(token, process.env.SECRET_KEY);

        if (verifyTOken) {
            // get user
            const activeUser = await userModel.findById(verifyTOken._id);

            res.status(200).json({ activeUser: activeUser });
        }
        else {
            res.json({ msg: "User is not Genuine !! Please Login again" });
        }
    }
    else {
        console.log("Token not found")
        res.json({ msg: "Token not found" });
    }

}


// get active user
module.exports.get_user_by_id = async (req, res) => {
    const id = req.params.id;

    // verify token
    const user = await userModel.findById(id);

    if (user) {
        res.status(200).json({ user });
    }
    else {
        res.json({ msg: "User is not Genuine !! Please Login again" });
    }
}




//////////////////////////////////////////////////
////////////// Edit profile

module.exports.edit_profile = async (req, res) => {
    try {

        if (req.body.token) {

            // verify token
            const verifyToken = jwt.verify(req.body.token, process.env.SECRET_KEY);

            if (verifyToken) {
                const updateProfile = await userModel.findByIdAndUpdate(verifyToken._id, {
                    name: req.body.user.name,
                    email: req.body.user.email,
                    mobile: req.body.user.mobile,
                    username: req.body.user.username
                });
            }

            const saveProfile = await updateProfile.save();

            if (saveProfile) {
                res.status(200).json({ msg: "Profile updated successfully" });
            }
            else {
                res.json({ msg: "Something wents wrong" });
            }
        }

    } catch (error) {
        res.json({ msg: error });
    }
}


//////////////////////////////////////////////////
////////////////// all users
module.exports.all_users = async (req, res) => {
    try {

        const users = await userModel.find();

        if (users) {
            res.status(200).json(users);
        }
        else {
            res.json({ msg: "Something wents wrongs" });
        }

    } catch (error) {
        console.log(error.message);
    }
}