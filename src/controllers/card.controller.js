// import User from "../models/User.js";
import Card from "../models/Card.js";

export const addCard = async(req, res)=>{
    const {IdCard, Identification, ngayCap, ngayHetHan, status}  = req.body
    try {
        if(!IdCard || !Identification || !ngayCap || !ngayHetHan || !status){
            return res.status(400).json({message: "All fields are required"})
        }
        const newCard = new Card({
            IdCard,
            Identification,
            ngayCap,
            ngayHetHan,
            status
        })
        if(newCard){
            await newCard.save()
            res.status(201).json({
                id: newCard._id,
                IdCard: newCard.IdCard,
                Identification: newCard.Identification,
                ngayCap: newCard.ngayCap,
                ngayHetHan: newCard.ngayHetHan,
                status: newCard.status
            })
        }else{
            res.status(400).json({message: "Invalid card data"})
        }
    } catch (error) {
        console.error("Error adding card:", error)
        res.status(500).json({ message: "Failed to add card. Please try again later." })
    }
}

export const getCard = async(req, res)=>{
    try {
        const filterCard = await Card.find().populate({
            path: 'Identification',
            localField: 'Identification',
            foreignField: 'Identification'
        })
        res.status(200).json({filterCard})
    } catch (error) {
        console.error("Error in getCard controller: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const searchCard = async (req, res) => {
    try {
        const { infoCard } = req.body;
        console.log('Searching for: ', infoCard);
        if (!infoCard) {
            return res.status(400).json({ message: "Card is required" });
        }

        const filterCard = await Card.find({
            $or: [
                { IdCard: { $regex: infoCard, $options: 'i' } },
                { Identification: { $regex: infoCard, $options: 'i' } }
            ]
        }).populate({
            path: 'Identification',
            localField: 'Identification',
            foreignField: 'Identification'
        })

        console.log("Filtered Card result: ", filterCard);
        res.status(200).json(filterCard);
    } catch (error) {
        console.error("Error in findUser controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

