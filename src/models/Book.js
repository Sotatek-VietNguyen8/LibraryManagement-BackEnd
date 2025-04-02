import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
    {
        IdBook: {
            type: String,
            required: true
        },
        bookName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        NXB: {
            type: String,
            required: true
        },
        soLuong: {
            type: Number,
            required: true,
            default: 0
        },
        soLuongCon:{
            type:Number,
            required:false,
            default: 0
        },
        pdfUrl:{
            type: String,
            required: false,
            default: ''
        }
    },
    {
        timestamps: true
    }
)

const Book = mongoose.model("Book", bookSchema)

export default Book