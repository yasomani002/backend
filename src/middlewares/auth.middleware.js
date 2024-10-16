import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from 'jsonwebtoken'
import { UserModel } from "../model/user.model"

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, 'Unauthorized request')
        }

        const decoredToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await UserModel.findById(decoredToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, 'Invalid access token.')
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error.message || 'Invalid access token.')
    }
})

export { verifyJWT }