 import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const  generateAcessAndRefreshToken= async(userId)=>{
    try{
        const  user=await User.findById(userId);
        const refreshToken=user.generateRefreshToken();
        const accessToken=user.generateAccessToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500,error)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation - not empty
    //check for images,check for avatar
    //check if user already exists: username,email
    //upload image to cloudinary,avatar
    //create  user object - create entry in db
    // remove password and refresh token field from response
    //check for user creation :not null
    // return res
    const body=req.body || {};
     const { fullName="", email="", username="", password="" } = body;
 
    if (
        [fullName, email, username, password].
            some((field) => !(field?.trim()))
    ) {
        throw new ApiError(400, "All fields are compulsory")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        if (existedUser.username === username) {
            throw new ApiError(409, "Username already exists");
        }

        if (existedUser.email === email) {
            throw new ApiError(409, "Email already exists");
        }

    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    
    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
         throw new ApiError(400,"Unable to upload avatar on cloudinary service. Avatar is required ")
    }

    const user=  await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser= await  User.findById(user._id)?.select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    )
    
    
});

const loginUser = asyncHandler(async(req,res)=>{
      //req->body
      //get username or email
      //find user
      //password check
      //generate access and refresh token
      // save refresh token in DB
      //send cookies
      //res successful
   
      const {email,username,password}=req.body

      if(!username && !email){
        throw new ApiError(400,"username or password is required");
      }

     const user=await User.findOne({
        $or:[{email},{username}]
      })
    
      if(!user){
        throw new ApiError(404,"User not found!");
      }
      const isPasswordValid= await user.isPasswordCorrect(password);
     
       if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials!");
      }
      
      const {accessToken,refreshToken}=await 
      generateAcessAndRefreshToken(user._id);

      const loggedInUser= await User.findById(user._id).
      select("-password -refreshToken")
 
      const options={
        httpOnly:true,
        secure:true
      }

      return res
      .status(200).cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,//may be user wants to save cookies
                refreshToken//may be user wants to save cookies
            },
            "User logged in successfully"
        )
      )

})

const logoutUser=asyncHandler(async (req,res)=>{
    //cookie delete
    //delete refresh token from db
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    
    const options={
        httpOnly:true,
        secure:true   
      }

      return res.status(200)
      .clearCookie("accessToken",options) 
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"User logged out successfully"))
})


export { registerUser,loginUser,logoutUser }