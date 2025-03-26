import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
export const signUp = async (req, res) => {
  const { Identification, userName, password, position, lop, SDT, email } = req.body
  try {
    if (!Identification || !userName || !password || !position) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const existingUser = await User.findOne({ Identification })  // Check if user already exists
    if (existingUser) {
        return res.status(409).json({ message: "User with this Identification already exists" })  // 409 Conflict
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      Identification,
      userName,
      password: hashedPassword,
      position,
      lop,
      SDT,
      email
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        id: newUser._id,
        Identification: newUser.Identification,
        userName: newUser.userName,
        position: newUser.position,
        lop: newUser.lop,
        SDT: newUser.SDT,
        email: newUser.email,
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error("Error during signup:", error)
    res.status(500).json({ message: "Signup failed. Please try again later." })
  }
}

export const login = async (req, res) => {
  const { Identification, password } = req.body

  try {
    const user = await User.findOne({ Identification })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const passwordCorrect = await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    generateToken(user._id, res)
    res.status(200).json({
      id: user._id,
      Identification: user.Identification,
      userName: user.userName,
      position: user.position,
      lop: user.lop,
      SDT: user.SDT,
      email: user.email,
    })
  } catch (error) {
    console.error("Error login controller:", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    return res.status(200).json({ message: "Logout Successfully" })
  } catch (error) {
    console.error("Error logout controller:", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const findUser = async(req, res)=>{
  try {
    const {infoUser} = req.body
    console.log('Searching for: ', infoUser)
    if(!infoUser){
      return res.status(400).json({message: "User is required"})
    }
    const filteredUser = await User.find({
      $and: [
        {
          $or:[
            {userName:{$regex: infoUser, $options: 'i'}},
            {Identification:{$regex: infoUser, $options: 'i'}}
          ]     
        },
        { position: {$ne: "Administator"}}
      ]
     
    })
    console.log("filteredUser results:", filteredUser)
    res.status(200).json(filteredUser)
  } catch (error) {
    console.error("Error in findUser controller", error.message)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getUser = async (req, res)=>{
  try {
    const filteredUser = await User.find({ position: {$ne: "Administator"}}).select("-password")
    res.status(200).json(filteredUser)
  } catch (error) {
    console.error("Error in getUser controller: ", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
  
}

export const updateUser = async (req, res) => {
  const { Identification, userName, lop, SDT, email } = req.body

  try {
    const user = await User.findOne({ Identification })

    if (!user) {
      return res.status(404).json({ message: "User not found" }) 
    }
    user.userName = userName || user.userName
    user.lop = lop || user.lop
    user.SDT = SDT || user.SDT
    user.email = email || user.email

    const updatedUser = await user.save()

    return res.status(200).json({
      message: "Updated user successfully",
      updatedUser
    })

  } catch (error) {
    console.error("Error in Updating controller: ", error)
    res.status(500).json({ message: "Internal server error. Please try again later." })  
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params
    const result = await User.findByIdAndDelete(_id)
    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ message: 'User deleted successfully' })

  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

