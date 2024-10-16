import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { UserModel } from '../model/user.model.js'
import { uploadOnClodinary } from '../utils/cloudinary.js'

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken()

        // save referesh token into database 
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while genertaing token')
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user data from FE
    // validation on data - not empty
    // check if user already exists ? - check with username & email
    // check for imagies / check for avatar
    // upload on clodinary , avatar
    // create user object for create entry for DB
    // remvove password & refresh token filed
    // check for user creation 
    // return response 

    // 1 : get user data from FE      
    const { userName, email, fullName, password } = req.body

    // 2 : validation on data - not empty
    if (
        [userName, email, fullName, password].some((filed) => {
            return filed?.trim() === ""
        })
    ) {
        throw new ApiError(400, "full name required")
    }

    // 3 : check if user already exists ? - check with username & email
    const existedUser = await UserModel.findOne({
        $or: [{ userName }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, 'User already exists.')
    }

    // 4 : check for imagies / check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar required.')
    }
    let coverIamgeLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverIamgeLocalPath = req.files.coverImage[0]?.path;
    }

    // 5 : upload on clodinary , avatar
    const avatar = await uploadOnClodinary(avatarLocalPath)
    const coverImage = await uploadOnClodinary(coverIamgeLocalPath)
    if (!avatar) {
        throw new ApiError(400, 'Avatar required.')
    }

    // 6 : create user object for create entry for DB
    const user = await UserModel.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        userName
    })

    // 7 :  remvove password & refresh token filed
    const createUser = await UserModel.findById(user._id).select("-password -refreshToken")

    // 8 : check for user creation 
    if (!createUser) {
        throw new ApiError(500, "Something went wrong while register user")
    }

    // 9 : return response 
    return res.status(201).json(
        new ApiResponse(200, createUser, 'User registerd sucessfully')
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // get email,password,username
    // check is user email or username available ?
    // find user
    // password check
    // access and refresh token generate
    // remvove password & refresh token filed
    // send token into cookie
    // return response 

    //1 : get email,password,username
    const { email, userName, password } = req.body

    //2 : check is user email or username available ?
    if (!userName || !email) {
        throw new ApiError(400, 'email or username required.')
    }

    //3 : find user
    const user = await UserModel.findOne({
        $or: [{ userName }, { email }]
    })
    if (!user) {
        throw new ApiError(400, 'user not register.')
    }

    //4 : password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, 'invalid user credential.')
    }

    //5 : access and refresh token generate
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    //6 : remvove password & refresh token filed
    const loggedInUser = UserModel.findById(user._id).select("-password -refreshToken")

    //7 : send token into cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    //8 : return response 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User login sucessfull"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logout sucessfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser
} 
