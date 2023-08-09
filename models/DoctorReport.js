
const mongoose = require('mongoose')

const doctorreportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is Required'
    },
    imageUrl: {
        type: String
    },
    toPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    date: {
        type: Date,
        default: Date.now
    }
})
// user_id : {
//   id : {
//       type : mongoose.Schema.Types.ObjectId,
//       ref : 'User'
//   }
// }
const DoctorReport = mongoose.model('DoctorReport', doctorreportSchema)

module.exports = DoctorReport;
