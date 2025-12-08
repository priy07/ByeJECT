// Transaction model deprecated - payment functionality removed.
// Keeping a minimal model here so old imports don't crash; it's unused.
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({}, { timestamps: true });

const Transaction = mongoose.model('Transaction_deprecated', transactionSchema);

export default Transaction;