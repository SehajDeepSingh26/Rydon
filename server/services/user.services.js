const {userModel} = require("../models/user.model");

module.exports.createUser = async({fullName, email, password}) => {
    if(!fullName.firstName || !fullName.lastName || !email || !password) {
        throw new Error("All fields are required");
    }
    const user = await userModel.create({fullName: {firstName: fullName.firstName, lastName: fullName.lastName}, email, password});

    return user;
}