const mongoose = require('mongoose');
const { Schema } = mongoose
const vacationInSeasonListenerSchema = new Schema({
    email: String,
    skus: [String],
});
const VacationInSeasonListener = mongoose.model('VacationInSeasonListener', vacationInSeasonListenerSchema);

module.exports = VacationInSeasonListener;