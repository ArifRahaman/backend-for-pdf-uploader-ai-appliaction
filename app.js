const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Pdf=require("./pdfDetails");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const userController = require("./Controllers/authUser");
// Load environment variables
require("dotenv").config();
const User = require('./models/User'); // Import the User model
// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://frontend-pdf-ai-chatbot-arifrahaman.onrender.com", // Explicit origin
    credentials: true,
  })
);



app.use("/files", express.static("files"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e.message);
  });


  
app.post("/signup", userController.signup);
app.post("/login", userController.login);

app.put("/user/:id", async (req, res) => {
  try {
            console.log("Request params:", req.params); // Log request params
            console.log("Request body:", req.body);  
    const { id} = req.params;
    const { username,  dob, universityname } = req.body;

    // Find user by ID and update
    const user = await User.findByIdAndUpdate(
      id,
      { username, dob, universityname },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      dob: user.dob,
      universityname: user.universityname,
    };

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("PUT /user/:id error:", error); // Add error logging here
    res.status(500).json({ error: "Internal server errororrrrrr" });
  }
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Generate unique filenames
  },
});

// Multer upload instance
const fileUpload = multer({ storage: fileStorage });

app.post(
  "/upload-profile-image",
  fileUpload.single("profileImage"),
  (req, res) => {
    // Access uploaded file via req.file
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // You can process the uploaded file here, such as saving its path to a database
    const filePath = req.file.path;
    const imageUrl = `https://backend-for-pdf-uploader-ai-appliaction-2.onrender.com/${filePath}`; // Modify this to match your server setup

    // Send a JSON response with the image URL
    res.json({ imageUrl });
  }
);

// app.get("/about", authenticate, (req, res) => {
//   console.log("hello world this is about page");
//   // res.send("hello world this is about page");
//   res.send(req.rootUser);
// });
// Multer configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Mongoose Model
require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");

// Routes
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get("/home", (req, res) => {
  // You can perform database operations or other tasks here
  res.json({ message: "Welcome to the backend!" });
});
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});// Update PDF title
app.put('/update-title/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // const updatedPdf = await PdfSchema.findByIdAndUpdate(
    //   id,
    //   { title },
    //   { new: true }
    // );
    const updatedPdf=await PdfSchema.findByIdAndUpdate(
      id,
      {title},
      {new: true}
    )

    if (!updatedPdf) {
      return res.status(404).json({ status: 'error', message: 'PDF not found' });
    }

    res.json({ status: 'ok', data: updatedPdf });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// Delete PDF file
app.delete('/delete-file/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPdf = await PdfSchema.findByIdAndDelete(id);

    if (!deletedPdf) {
      return res.status(404).json({ status: 'error', message: 'PDF not found' });
    }

    res.json({ status: 'ok', message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// 
// const userCollectionName = "users";
app.get("/api/users/count", async (req, res) => {
  try {
    // Count documents using the User model
    const totalUsers = await User.countDocuments();

    // Send the total count as JSON response
    res.json({ total: totalUsers });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users/pdf", async (req, res) => {
  try {
    // Count documents using the User model
    const totalUsers = await Pdf.countDocuments();

    // Send the total count as JSON response
    res.json({ total: totalUsers });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const multer = require("multer");
// const userController = require("./Controllers/authUser");
// const User = require("./models/User"); // Import the User model

// // Load environment variables
// require("dotenv").config();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use("/files", express.static("files"));
// app.use("/profilePictures", express.static("profilePictures")); // Serve profile pictures

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to Mongodb");
//   })
//   .catch((e) => {
//     console.error("MongoDB connection error:", e.message);
//   });

// app.post("/signup", userController.signup);
// app.post("/login", userController.login);

// app.put("/user/:id", async (req, res) => {
//   try {
//     console.log("Request params:", req.params); // Log request params
//     console.log("Request body:", req.body);
//     const { id } = req.params;
//     const { username, dob, universityname } = req.body;

//     // Find user by ID and update
//     const user = await User.findByIdAndUpdate(
//       id,
//       { username, dob, universityname },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const updatedUser = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       dob: user.dob,
//       universityname: user.universityname,
//     };

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("PUT /user/:id error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Multer configuration for files
// const storageFiles = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./files");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const uploadFiles = multer({ storage: storageFiles });

// // Multer configuration for profile picture
// const storageProfilePicture = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./profilePictures");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const uploadProfilePicture = multer({ storage: storageProfilePicture });

// // Mongoose Model
// require("./pdfDetails");
// const PdfSchema = mongoose.model("PdfDetails");

// // Routes
// app.post("/upload-files", uploadFiles.single("file"), async (req, res) => {
//   console.log(req.file);
//   const title = req.body.title;
//   const fileName = req.file.filename;
//   try {
//     await PdfSchema.create({ title: title, pdf: fileName });
//     res.send({ status: "ok" });
//   } catch (error) {
//     console.error("Error uploading file:", error.message);
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// app.post(
//   "/upload-profile-picture",
//   uploadProfilePicture.single("image"),
//   async (req, res) => {
//     try {
//       const userId = req.body.userId;
//       const imagePath = req.file.filename;

//       // Find user by ID and update profile picture
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { profilePicture: imagePath },
//         { new: true }
//       );

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       res.status(200).json({ image: imagePath });
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

// app.get("/get-files", async (req, res) => {
//   try {
//     const data = await PdfSchema.find({});
//     res.send({ status: "ok", data: data });
//   } catch (error) {
//     console.error("Error fetching files:", error.message);
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// app.get("/", async (req, res) => {
//   res.send("Success!!!!!!");
// });

// // Update PDF title
// app.put("/update-title/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title } = req.body;

//     const updatedPdf = await PdfSchema.findByIdAndUpdate(
//       id,
//       { title },
//       { new: true }
//     );

//     if (!updatedPdf) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "PDF not found" });
//     }

//     res.json({ status: "ok", data: updatedPdf });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// // Delete PDF file
// app.delete("/delete-file/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedPdf = await PdfSchema.findByIdAndDelete(id);

//     if (!deletedPdf) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "PDF not found" });
//     }

//     res.json({ status: "ok", message: "PDF deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });




