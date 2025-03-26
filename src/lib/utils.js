import jwt from "jsonwebtoken"

export const generateToken = (userId , res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d", })
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true, // Điều này giúp giảm thiểu nguy cơ tấn công XSS (Cross-Site Scripting), trong đó kẻ tấn công có thể chèn mã JavaScript độc hại vào trang web và đánh cắp cookie.
        sameSite: "Strict", //Thuộc tính này giúp bảo vệ chống lại tấn công CSRF (Cross-Site Request Forgery).
        secure: process.env.NODE_ENV !== "development" // Thuộc tính này chỉ định cookie chỉ nên được gửi qua kết nối HTTPS

    })
    return token
}