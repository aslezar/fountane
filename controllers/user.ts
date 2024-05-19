import User from "../models/user"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors"
import { Request, Response } from "express"
import mongoose from "mongoose"
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
    uploadAssetsImages as cloudinaryUploadAssetsImages,
    deleteAssetImages as cloudinaryDeleteAssetImages,
} from "../utils/imageHandlers/cloudinary"

const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.userId)
    if (!user) throw new UnauthenticatedError("User Not Found")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")

    // setTokenCookies(res, user)

    const sendUser = {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        profileImage: user.profileImage,
        isVendor: user.vendorProfile ? true : false,
        vendorProfile: user.vendorProfile,
    }

    res.status(StatusCodes.CREATED).json({
        data: sendUser,
        success: true,
        msg: "User Fetched Successfully",
    })
}

const updateUser = async (
    userId: mongoose.Types.ObjectId,
    key: string,
    value: any,
) => {
    const user = await User.findById(userId)
    if (!user) throw new UnauthenticatedError("User Not Found")
    user.set({ [key]: value })
    await user.save()
}

const updateCompleteProfile = async (req: Request, res: Response) => {
    const { name, phoneNo } = req.body
    const userId = req.user.userId

    if (!name || !phoneNo)
        throw new BadRequestError("Name or Phone Number are required")

    const user = await User.findByIdAndUpdate(userId, {
        name,
        phoneNo,
    })

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Profile Updated Successfully",
    })
}

const updateProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId
    if (!req.file) throw new BadRequestError("Image is required")

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")

    const cloudinary_img_url = await cloudinaryUploadProfileImage(req)
    await updateUser(userId, "profileImage", cloudinary_img_url)

    res.status(StatusCodes.OK).json({
        data: { profileImage: cloudinary_img_url },
        success: true,
        msg: "Image Updated Successfully",
    })
}

const deleteProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")
    await updateUser(
        userId,
        "profileImage",
        "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
    )

    res.status(StatusCodes.OK).json({
        data: {
            defaultProfileImage:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        success: true,
        msg: "Image Deleted Successfully",
    })
}

export { getMe, updateCompleteProfile, updateProfileImage, deleteProfileImage }
