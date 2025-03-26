import mongoose from "mongoose";

const docketSchema  = new mongoose.Schema(
    {
        IdDocket:{
            type: String,
            required: true,
            unique: true  
        },
        IdCard: {
            type: String,
            required: true,
            ref: 'Card',
            // localField: 'Card',  // No need for these
            // foreignField: 'Card'
        },
        IdBook: {
            type: String,
            required: true,
            ref: 'Book',
            // localField: 'IdBook',  // No need for these
            // foreignField: 'IdBook'
        },
        Identification: {
            type: String,
            required: true,
            ref: 'User',
        },
        ngayMuon: {
            type: Date,
            required: true
        },
        ngayHenTra: {
            type: Date,
            required: true
        },
        soLuongMuon: {
            type: Number,
            required: true,
            default: 1, 
            min: 1
        },
        ngayTra: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ['active', 'overdue', 'returned'],
            default: 'active'  
        },

    }
)

const docket = mongoose.model("docket", docketSchema)
export default docket