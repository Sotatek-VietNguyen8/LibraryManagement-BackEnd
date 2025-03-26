import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
    {
        IdBook: {
            type: String,
            require: true
        },
        bookName: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        author: {
            type: String,
            require: true
        },
        NXB: {
            type: String,
            require: true
        },
        soLuong: {
            type: Number,
            require: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Book = mongoose.model("Book", bookSchema)

export default Book