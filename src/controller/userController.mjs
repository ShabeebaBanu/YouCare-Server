import express from "express";
import userServiceImp from "../service/userServiceImp.mjs";

const userRouter = express.Router();

//need to check email already exist
userRouter.post("/create", async (req, res) => {
    try{
        const user = await userServiceImp.createUser(req.body);
        return res.status(201).json({ message: "User Created successfully!", user});
    }catch(error){
        return res.status(500).json({ message: "Error creating user", error});
    }
    
});

userRouter.get("/all", async (req, res) => {
    try{
        const users =  await userServiceImp.getAllUsers(req, res);
        return res.status(201).json({ message: "Fetched all users successfullty!", users});
    }catch(error){
        return res.status(500).json({ message: "Error fetching users", error});
    }
});

userRouter.get("/:userId", async (req, res) => {
    try{
        const user = await userServiceImp.getUserByUserId(req.params.userId);
        if(!user){
            return res.status(404).json({ message: `User with ID ${req.params.userId} not found`});
        }
        return res.status(201).json({ message: "User fetched successfully!", user});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the user with ID ${req.params.userId}`});
    }
});

userRouter.get("/district/:district", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByDistrict(req.params.district);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found in ${req.params.district}`});
        }
        return res.status(201).json({ message: `Fetched all usres from ${req.params.district} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with district ${req.params.district}`});
    }
}),

userRouter.get("/province/:province", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByProvince(req.params.province);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found in ${req.params.province}`});
        }
        return res.status(201).json({ message: `Fetched all usres from ${req.params.province} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with province ${req.params.province}`});
    }
});

userRouter.get("/role/:role", async (req, res) => {
    try{
        const users = await userServiceImp.getUsersByRole(req.params.role);
        if(users.length == 0){
            return res.status(404).json({ message: `No users found with role ${req.params.role}`});
        }
        return res.status(201).json({ message: `Fetched all usres with role ${req.params.role} successfully!`, users});
    }catch(error){
        return res.status(500).json({ message: `Error fetching the users with role ${req.params.role}`});
    }
});

userRouter.delete("/:userId", async (req, res) => {
    try{
        const deletedUser = await userServiceImp.deleteUserByUserId(req.params.userId);
        if(!deletedUser){
            return res.status(404).json({ message: `No users found with ID ${req.params.userId}`});
        }
        return res.status(201).json({ message: `User with ID ${req.params.userId} deleted successfully!`, deletedUser});
    }catch(error){
        return res.status(500).json({ message: `Error deleting the user with ID ${req.params.userId}`});
    }
});

export default userRouter;