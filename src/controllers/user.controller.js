import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { UserModel } from '../model/user.model.js'
import { uploadOnClodinary } from '../utils/cloudinary.js'

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

export { registerUser } 
