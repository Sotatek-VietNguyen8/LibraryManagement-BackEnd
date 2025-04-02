import mongoose from "mongoose"
import Book from "../models/Book.js"
import Card from "../models/Card.js"
import Docket from "../models/docket.js"
import User from "../models/User.js"
import docket from "../models/docket.js"
export const creatDocket = async (req, res) => {
    const { IdDocket, IdCard, IdBook, Identification, ngayMuon, ngayHenTra, ngayTra, soLuongMuon } = req.body

    try {
        if (!IdDocket || !IdCard || !IdBook || !Identification || !ngayMuon || !ngayHenTra || !soLuongMuon) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const today = new Date()
        const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        const muonDate = new Date(ngayMuon)
        const muonDateStartOfDay = new Date(muonDate.getFullYear(), muonDate.getMonth(), muonDate.getDate())

        if (muonDateStartOfDay.getTime() !== todayStartOfDay.getTime()) {
            return res.status(400).json({ message: "Ngày mượn phải là ngày hiện tại." })
        }

        const henTraDate = new Date(ngayHenTra)
        const traDate = ngayTra ? new Date(ngayTra) : null

        if (isNaN(muonDate.getTime()) || isNaN(henTraDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format. Please use a valid date string." })
        }

        if (ngayTra && isNaN(traDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format for ngayTra. Please use a valid date string." })
        }

        const maxNgayHenTra = new Date(muonDate)
        maxNgayHenTra.setMonth(muonDate.getMonth() + 4)

        if (henTraDate.getTime() > maxNgayHenTra.getTime()) {
            return res.status(400).json({ message: "Ngày hẹn trả không được vượt quá 4 tháng so với ngày mượn." })
        }
        const docketExists = await Docket.findOne({ IdDocket: IdDocket })
        if (docketExists) {
            return res.status(400).json({ message: "docket with provided IdDocket already exists." })
        }

        const cardExists = await Card.findOne({ IdCard: IdCard })
        if (!cardExists) {
            return res.status(400).json({ message: "Card with provided IdCard does not exist." })
        }

        const AdminExists = await User.findOne({ Identification: Identification })
        if (!AdminExists) {
            return res.status(400).json({ message: "Admin with provided Identification does not exist." })
        }

        const hasExistingLoan = await Docket.findOne({
            IdBook: IdBook,
            IdCard: IdCard,
            status: 'active' 
        })
        if (hasExistingLoan) {
            return res.status(400).json({ message: "Students have borrowed this book." })
        }

        // Sử dụng Transaction
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const book = await Book.findOne({ IdBook: IdBook }).session(session)
            if (!book) {
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({ message: "Book with provided IdBook does not exist." })
            }

            if (book.soLuong < soLuongMuon) {
                await session.abortTransaction()
                session.endSession()
                return res.status(400).json({ message: "Không đủ số lượng sách để mượn." })
            }
            book.soLuongCon = book.soLuong - soLuongMuon
            //book.soLuong -= soLuongMuon
            await book.save({ session })

            const newDocket = new Docket({
                IdDocket,
                IdCard,
                IdBook,
                Identification,
                ngayMuon,
                ngayHenTra,
                ngayTra: traDate ? traDate : null,
                soLuongMuon,
            })

            await newDocket.save({ session }) 
            await session.commitTransaction()
            session.endSession()

            if (newDocket) {
               
                res.status(201).json({
                    IdDocket: newDocket.IdDocket,
                    IdCard: newDocket.IdCard,
                    IdBook: newDocket.IdBook,
                    Identification: newDocket.Identification,
                    ngayMuon: newDocket.ngayMuon,
                    ngayHenTra: newDocket.ngayHenTra,
                    ngayTra: newDocket.ngayTra,
                    status: newDocket.status,
                    soLuongMuon: newDocket.soLuongMuon
                })
            } else {
                return res.status(400).json({ message: "Invalid docket data" })
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            console.error("Error creating docket:", error)
            if (error.name === 'ValidationError') {
                const errors = {}
                for (let field in error.errors) {
                    errors[field] = error.errors[field].message
                }
                return res.status(400).json({ message: "Validation error", errors: errors })
            }
            return res.status(500).json({ message: "Failed to create docket. Please try again later." })
        }
    } catch (error) {
        console.error("Error creating docket:", error)
        if (error.name === 'ValidationError') {
            const errors = {}
            for (let field in error.errors) {
                errors[field] = error.errors[field].message
            }
            return res.status(400).json({ message: "Validation error", errors: errors })
        }
        res.status(500).json({ message: "Failed to create docket. Please try again later." })
    }
}


export const getDocket = async (req, res) => {
    try {
        const filerDocket = await Docket.find()
        res.status(200).json(filerDocket)
    } catch (error) {
        console.log('Error in getDocket controller', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const checkAndUpdateStatus = async (req, res) => {
    try {
        const today = new Date()
        const overdueDockets = await Docket.find({
            status: 'active',
            ngayHenTra: { $lt: today }
        })
        for (const docketRecord of overdueDockets) {
            docketRecord.status = 'overdue'
            await docketRecord.save()
        }
        console.log('Manual check complete. Updated dockets.')
        res.status(201).json({ message: 'Check - Updated Successfully' })
    } catch (error) {
        console.error('Error checking and updating dockets:', error)
        res.status(500).json({ message: "Error during manual check and update." })
    }
}

export const deleteDocket = async(req, res)=>{
    try {
        const {_id} =req.params
        const result = await docket.findOneAndDelete({
            _id: _id,
            status: 'returned'
        })
        if (!result) {
            return res.status(404).json({ message: 'Docket not found or not return Book' })
        }

        res.status(200).json({ message: 'Docket deleted successfully' })
    } catch (error) {
        console.error('Error deleting Docket:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
export const searchDocket = async (req, res)=>{
    try {
        const {infoDocket} = req.body
        if(!infoDocket){
            return res.status(400).json({message: 'Docket is required'})
        }
        const resultSearch = await docket.find({
            $or:[
                {Identification: {$regex: infoDocket } },
                {IdCard: {$regex: infoDocket} },
                {IdBook: {$regex: infoDocket} },
            ]
        })
        console.log("Filtered Docket result: ", resultSearch)
        res.status(200).json(resultSearch)
    } catch (error) {
        console.error("Error in searchDocket controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const upadateTraSach = async (req, res) => {
    const { _id } = req.params
    const { ngayTra , status} = req.body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const docketRecord = await Docket.findById(_id).session(session)
        if (!docketRecord) {
            await session.abortTransaction()
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn.' })
        }

        if (docketRecord.ngayTra) {
            await session.abortTransaction()
            return res.status(400).json({ message: 'Sách đã được trả rồi.' })
        }

        const book = await Book.findOne({ IdBook: docketRecord.IdBook }).session(session)
        if (!book) {
            await session.abortTransaction()
            return res.status(500).json({ message: 'Lỗi dữ liệu: Không tìm thấy sách.' })
        }

        docketRecord.ngayTra = new Date(ngayTra)
        docketRecord.status = status
        book.soLuongCon += docketRecord.soLuongMuon

        await docketRecord.save({ session })
        await book.save({ session })
        await session.commitTransaction()

        res.json({ message: "Cập nhật trả sách thành công", docket: docketRecord })

    } catch (error) {
        await session.abortTransaction()
        console.error("Lỗi cập nhật trả sách:", error)
        res.status(500).json({ message: "Lỗi server khi cập nhật trả sách" })
    } finally {
        session.endSession()
    }
}

// cần cải thiện getBorrowedBooks 
export const getBorrowedBooks = async (req, res) => {
    const { Identification } = req.query

    if (!Identification) {
        return res.status(400).json({ message: "Identification is required" })
    }

    try {
        const borrowedDockets = await Docket.find({ Identification: Identification })

        const bookIds = borrowedDockets.map(docket => docket.IdBook)

        const books = await Book.find({ IdBook: { $in: bookIds } })

        const bookMap = {}
        books.forEach(book => {
            bookMap[book.IdBook] = book
        })

        const borrowedDocketsWithBooks = borrowedDockets.map(docket => ({
            ...docket.toObject(),
            book: bookMap[docket.IdBook] || null 
        }))

        res.json(borrowedDocketsWithBooks)

    } catch (error) {
        console.error('Error getting borrowed books:', error)
        res.status(500).json({ message: "Failed to get borrowed books", error: error.message })
    }
}

