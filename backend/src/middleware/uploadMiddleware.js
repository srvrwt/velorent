const multer = require("multer");
const path = require("path");
const fs = require("fs");



// CREATE UPLOAD DIRECTORIES


const bikeUploadPath = path.join(
  __dirname,
  "../../uploads/bikes"
);

const documentUploadPath = path.join(
  __dirname,
  "../../uploads/documents"
);


if (!fs.existsSync(bikeUploadPath)) {
  fs.mkdirSync(
    bikeUploadPath,
    {
      recursive: true,
    }
  );
}


if (!fs.existsSync(documentUploadPath)) {
  fs.mkdirSync(
    documentUploadPath,
    {
      recursive: true,
    }
  );
}



// STORAGE


const storage =
  multer.diskStorage({

    destination: function (
      req,
      file,
      cb
    ) {

      // Documents
      if (
        file.fieldname ===
          "rcDocument" ||
        file.fieldname ===
          "idProof"
      ) {

        cb(
          null,
          documentUploadPath
        );

      }

      // Bike images
      else {

        cb(
          null,
          bikeUploadPath
        );

      }

    },


    filename: function (
      req,
      file,
      cb
    ) {

      const uniqueName =
        Date.now() +
        "-" +
        Math.round(
          Math.random() *
            1000000000
        ) +
        path.extname(
          file.originalname
        );


      cb(
        null,
        uniqueName
      );

    },

  });



// FILE FILTER


const fileFilter = (
  req,
  file,
  cb
) => {

  // Allowed image types
  const imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];


  // Allowed document types
  const documentTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];


  if (
    file.fieldname ===
      "rcDocument" ||
    file.fieldname ===
      "idProof"
  ) {

    if (
      documentTypes.includes(
        file.mimetype
      )
    ) {

      cb(
        null,
        true
      );

    } else {

      cb(
        new Error(
          "RC and ID proof must be JPG, PNG or PDF"
        )
      );

    }

  } else {

    if (
      imageTypes.includes(
        file.mimetype
      )
    ) {

      cb(
        null,
        true
      );

    } else {

      cb(
        new Error(
          "Bike images must be JPG, PNG or WEBP"
        )
      );

    }

  }

};



// MULTER


const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        5 * 1024 * 1024,

    },

  });


module.exports =
  upload;