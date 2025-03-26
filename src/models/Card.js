import mongoose from "mongoose"

const cardSchema = new mongoose.Schema(
    {
        IdCard: {
            type: String,
            required: true
        },
        Identification: {
            type: String,
            required: true,
            unique: true, 
            ref: 'User',
            localField: 'Identification',
            foreignField: 'Identification'
        },
        ngayCap: {
            type: Date,
            required: true
        },
        ngayHetHan: {
            type: Date,
            required: true
        },
        status:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Card = mongoose.model("Card", cardSchema)
export default Card