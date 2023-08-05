const mongoose=require("mongoose");

const connectDB= async ()=>{
    try{
        const conn=await mongoose.connect("mongodb+srv://NipunTulsian:nipun100@cluster0.fzwnons.mongodb.net/Greddiit?retryWrites=true&w=majority");
        console.log(`MongoDB connected: ${conn.connection.host.cyan}`.cyan.underline)

    }catch(err){
        console.log(err);
    }
}
module.exports = connectDB;