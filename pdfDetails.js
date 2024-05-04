// const mongoose = require("mongoose");

// const PdfDetailsSchema = new mongoose.Schema(
//   {
//     pdf: String,
//     title: String,
//   },
//   { collection: "PdfDetails" }
// );

// // mongoose.model("PdfDetails", PdfDetailsSchema);
// module.exports = mongoose.model("PdfDetails", PdfDetailsSchema);

// // module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PdfDetailsSchema = new Schema(
  {
    pdf: String,
    title: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "PdfDetails" }
);

module.exports = mongoose.model("PdfDetails", PdfDetailsSchema);
