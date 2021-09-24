import multer from "multer";

const router = multer({
  storage: multer.diskStorage({
    destination: `./database/assets/images`,
    filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${req.query.userid}.png`);
    },
  }),
});

const uploadPI = router.single("profile");

export const UploadProfileImage = (req, res) => {
  uploadPI(req, res, (err) => {
    if (err) {
      res.send({
        error: err.message,
      });
    } else {
      res.send("DONE");
    }
  });
};
