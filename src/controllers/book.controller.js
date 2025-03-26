import mongoose from "mongoose";
import Book from "../models/Book.js";
export const addBook = async (req, res) => {
    const { IdBook ,bookName, description, author, NXB, soLuong } = req.body;
    try {
      if (!IdBook || !bookName || !description || !author || !NXB || !soLuong) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const newBook = new Book({
        IdBook,
        bookName,
        description,
        author,
        NXB,
        soLuong
      });
  
      if (newBook) {
        await newBook.save();
        res.status(201).json({
          id: newBook._id,
          IdBook: newBook.IdBook,
          bookName: newBook.bookName,
          description: newBook.description,
          author: newBook.author,
          NXB: newBook.NXB,
          soLuong: newBook.soLuong,
        });
      } else {
        res.status(400).json({ message: "Invalid book data" });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ message: "Failed to add book. Please try again later." });
    }
  };
  
  export const getBook = async (req, res) => {
    try {
      const fiterBook = await Book.find(); 
      res.status(200).json(fiterBook);
    } catch (error) {
      console.error("Error in getBook controller: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  export const searchBook = async (req, res) => {
    try {
      const { bookName } = req.body;
  
      if (!bookName) {
        return res.status(400).json({ message: "BookName is required" });
      }
      const filteredBooks = await Book.find({ bookName: { $regex: bookName, $options: 'i' } });
  
      if (!filteredBooks || filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found " });
      }
  
      res.status(200).json(filteredBooks);
    } catch (error) {
      console.error("Error in searchBook controller: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
export const updateBook = async (req, res) => {
  try {
    const { _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid book ID format" })
    }

    const {IdBook, bookName, author, NXB, soLuong } = req.body

    const book = await Book.findById(_id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    book.IdBook = IdBook || book.IdBook
    book.bookName = bookName || book.bookName
    book.author = author || book.author
    book.NXB = NXB || book.NXB
    book.soLuong = Number(soLuong) || book.soLuong

    const updatedBook = await book.save()

    return res.status(200).json({
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    console.error("Error in Updating controller: ", error)
    res.status(500).json({ message: "Internal server error. Please try again later." })
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { _id } = req.params
    const result = await Book.findByIdAndDelete(_id)

    if (!result) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.status(200).json({ message: 'Book deleted successfully' })

  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
};

export const bookById = async(req, res) =>{
  try {
      const IdBook = req.params.IdBook
      const book = await Book.findOne({IdBook: IdBook})

      if(!book){
          return res.status(400).json({message: "Failed to find Book"})
      }

      res.status(200).json({book})

  } catch (error) {
      console.log("Error get card:", error)
      res.status(500).json({message: "Failed to get card"})
  }
}
  