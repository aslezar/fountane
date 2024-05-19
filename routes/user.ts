import { Router } from "express"
import upload from "../utils/imageHandlers/multer"
import {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    getAllAssets,
    uploadAssets,
    deleteAsset,
    followUnfollowUser,
    isFollowing,
} from "../controllers/user"
import userBlogRouter from "./userBlog"

const router = Router()

router.route("/me").get(getMe)
router.use("/blog", userBlogRouter)
router.patch("/update-profile", updateCompleteProfile)
router
    .route("/image")
    .post(upload.single("profileImage"), updateProfileImage)
    .delete(deleteProfileImage)
router
    .route("/assets")
    .get(getAllAssets)
    .post(upload.array("assetFiles", 5), uploadAssets)
    .delete(deleteAsset)
router.post("/follow-unfollow", followUnfollowUser)
router.post("/is-following", isFollowing)

export default router
