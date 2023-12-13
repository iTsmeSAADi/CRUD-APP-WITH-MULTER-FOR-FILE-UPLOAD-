import mongoose from "mongoose";

const connect_db = async (DB_URL) => {
try {
    const DB_DATA = {
        dbName: 'userDB'
    }
    await mongoose.connect(DB_URL, DB_DATA)
    console.log(`DATABASE CONNECTED SUCCESSFULLY`)
} catch (error) {
    console.log(`ERROR CONNECIING TO DB`, error)
}
}

export default connect_db