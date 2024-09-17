import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLODINARY_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});


const uploadOnClodinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;
        // upload file on clodinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        })

        // file ha been uploaded sucessfully
        fs.unlinkSync(localfilepath) // remove the local save file if uploading fail
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath) // remove the local save file if uploading fail
    }
}



export { uploadOnClodinary }