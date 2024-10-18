import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,
            require: true,
        },
        thumbnail: {
            type: String,
            require: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        duration: {
            type: Number,
            require: true,
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)
const VideoModel = mongoose.model('Video', videoSchema)

export { VideoModel }