const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("dotenv").config();
const cloudinary = require("cloudinary");
const upload = require("../handlers/multer");
const Report = require("../models/Report");
const Patient = require("../models/Patient");
const AdminReport = require("../models/AdminReport");
const {
  ensureAuthenticated_patient,
  ensureAuthenticated_doctor,
  ensureAuthenticated_admin,
} = require("../config/auth");
const DoctorReport = require("../models/DoctorReport");

require("../handlers/cloudinary");

router.get("/uploadreport", ensureAuthenticated_patient, (req, res) => {
  res.render("uploadreport", {
    user: req.user,
  });
});

router.get("/adminupload/:id", ensureAuthenticated_admin, (req, res) => {
  res.render("adminreport", {
    user: req.user,
  });
  toPatient = req.params.id;
});

router.get("/doctorupload/:id", ensureAuthenticated_doctor, (req, res) => {
  res.render("doctorreport", {
    user: req.user,
  });
  toPatient = req.params.id;
});

router.post("/upload_reports", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const image = req.file;

  let errors = [];

  if (!title) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  if (!image) {
    errors.push({
      msg: "Please upload an image",
    });
  }

  if (errors.length > 0) {
    req.flash("error_msg", "Please fill in all required fields");
    res.redirect("/uploadreport");
  } else {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      const report = new Report();
      report.title = req.body.title;
      report.imageUrl = result.secure_url;
      report.patientid = req.user._id;
      await report.save();
      req.flash("success_msg", "Report Uploaded Successfully!");
      res.redirect("/myUploads");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "An error occurred. Please try again.");
      res.redirect("/uploadreport");
    }
  }
});


router.post("/adminupload/:id", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const image = req.file;

  let errors = [];

  if (!title) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  if (!image) {
    errors.push({
      msg: "Please upload an image",
    });
  }

  if (errors.length > 0) {
    req.flash("error_msg", "Please fill in all required fields");
    res.redirect("/adminupload/:id");
  } else {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      const adminreport = new AdminReport();
      adminreport.title = req.body.title;
      adminreport.imageUrl = result.secure_url;
      adminreport.toPatient = toPatient;
      await adminreport.save();
      req.flash("success_msg", "Report Uploaded Successfully!");
      res.redirect("/adminupload/:id");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "An error occurred. Please try again.");
      res.redirect("/viewpatients");
    }
  }
});


router.post("/doctorUpload", upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const image = req.file;

  let errors = [];

  if (!title) {
    errors.push({
      msg: "Please fill in all required fields",
    });
  }

  if (!image) {
    errors.push({
      msg: "Please upload an image",
    });
  }

  if (errors.length > 0) {
    req.flash("error_msg", "Please fill in all required fields");
    res.redirect("/doctorupload/:id");
  } else {
    try {
      
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      const doctorreport = new DoctorReport();
      doctorreport.title = req.body.title;
      doctorreport.imageUrl = result.secure_url;
      doctorreport.toPatient = toPatient;
      await doctorreport.save();
      req.flash("success_msg", "Report Uploaded Successfully!");
      res.redirect("/doctorupload/:id");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "An error occurred. Please try again.");
      res.redirect("/viewpatients");
    }
  }
});


// router.get('/seereport', async (req, res) => {
//   // Method 1
//   // const user_id = req.user._id;
//   // const patient = await Patient.findById(user_id);
//   // const images = await Report.find({ "patientid": patient._id })

//   // Method 2
//   const images = await Report.find({ "patientid": req.user._id })
//   const adminimages = await AdminReport.find({})
//   res.render('seereport', {
//     images,
//     adminimages,
//     user: req.user
//   });
// });

//See uploaded reports

router.get("/myuploads", ensureAuthenticated_patient, async (req, res) => {
  // Method 1
  // const user_id = req.user._id;
  // const patient = await Patient.findById(user_id);
  // const images = await Report.find({ "patientid": patient._id })

  // Method 2
  const images = await Report.find({
    patientid: req.user._id,
  });
  res.render("patientUploads", {
    role: "Patient",
    images,
    user: req.user,
  });
});

//See reports from hospital

router.get("/fromhospital", ensureAuthenticated_patient, async (req, res) => {
  const adminimages = await AdminReport.find({
    toPatient: req.user._id,
  });
  res.render("hospitalUploads", {
    role: "Patient",
    adminimages,
    user: req.user,
  });
});

//image upload.single must match with form name
// res.send(result);
// middleware = require('../middleware');
// const { ensureAuthenticated2 } = require('../config/auth');

//Mongo URI
//const mongoURI ='mongodb+srv://ujjwal:Pranjita@patients-evtmn.mongodb.net/test?retryWrites=true&w=majority';

// // // Create mongo connection
// const conn = mongoose.createConnection(mongoURI);
// // to upload photoes
// //patient upload report

// router.get('/uploadreports',ensureAuthenticated2, (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       res.render('uploadreport', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('uploadreport', { files: files });
//     }

//   });
// });
// // Init gfs
// let gfs;

// conn.once('open', () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// // Create storage engine
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });

// // @route POST /upload
// // @desc  Uploads file to DB
// router.post('/upload',middleware.upload.single('file'), (req, res) => {
//   //res.json({ file: req.file });
//   Patient.findById(req.email, (err, foundUser) => {
//     res.redirect('/uploadreports');
//     if(err) throw err;

//       const imagePath = path.join(__dirname, '/public/image');
//       if(fs.existsSync(imagePath+foundUser.image)) {
//           deleteImage(imagePath+foundUser.image);
//       }

// });
// });

// // router.post('/upload', upload.single('file'), (req, res,next) => {
// //   if (!authorized){
// //     res.send(403);
// //   } else
// //     next();
// // });

// // @route GET /files
// // @desc  Display all files in JSON
// router.get('/files', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// })

// // @route GET /files/:filename
// // @desc  Display single file object
// router.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// router.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// router.delete('/files/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.redirect('/patientdashboard');
//   });
// })

module.exports = router;
