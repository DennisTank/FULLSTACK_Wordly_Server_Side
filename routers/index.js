import express from "express";
import mysqlConnection from "../database/index.js";
import mail from "../auth/mail.js";
import querys from "../database/querys.js";
import errors from "./errors.js";

const router = express.Router();

//auth
router.get("/auth", async (req, res) => {
  const result = await mail(req.query.email);
  res.send(result);
});

/* ALL USER HANDLERS */
// add a new user
router.post("/register", (req, res) => {
  //check is username and email exist
  mysqlConnection.query(
    querys.checkReg,
    [req.query.username, req.query.email],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      } else if (rows.length === 2) {
        res.send({ error: errors.SIGNIN.BOTH });
        return;
      } else if (rows.length === 1) {
        if (
          req.query.username === rows[0].username &&
          req.query.email === rows[0].email
        ) {
          res.send({ error: errors.SIGNIN.BOTH });
        } else if (req.query.username === rows[0].username) {
          res.send({ error: errors.SIGNIN.UN });
        } else {
          res.send({ error: errors.SIGNIN.E });
        }
        return;
      } else {
        // than add
        mysqlConnection.query(
          querys.register,
          [
            req.query.username,
            req.query.password,
            req.query.dob,
            req.query.email,
            req.query.bio,
          ],
          (err, rows, fields) => {
            if (err) {
              res.send({ error: errors.SSE });
              console.log(err.message);
              return;
            }
            req.query.isLoggedin = true;
            res.send({ ...req.query, userid: rows.insertId });
          }
        );
      }
    }
  );
});
router.get("/login", (req, res) => {
  mysqlConnection.query(
    querys.login,
    req.query.username,
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      if (rows?.[0]?.password && rows[0].password === req.query.password) {
        delete rows[0].password;
        rows[0].isLoggedin = true;
        res.send(rows[0]);
      } else {
        res.send({ error: errors.LOGIN });
      }
    }
  );
});

// get single user
router.get("/user", (req, res) => {
  mysqlConnection.query(
    querys.user,
    [req.query.userid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send(rows[0]);
    }
  );
});

// search list of users
// router.get("/search", (req, res) => {
//   mysqlConnection.query(
//     querys.search,
//     ["%".concat(req.query.username, "%")],
//     (err, rows, fields) => {
//       if (err) {
//         res.send({ error: errors.SSE });
//         console.log(err.message);
//         return;
//       }
//       res.send(rows);
//     }
//   );
// });
/* ALL UPDATES -----------------------*/
router.patch("/update_username", (req, res) => {
  mysqlConnection.query(
    querys.update.checkUN,
    req.query.username,
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      if (rows.length === 1) {
        res.send({ error: errors.SIGNIN.UN });
      } else {
        mysqlConnection.query(
          querys.update.username,
          [req.query.username, req.query.userid],
          (err, rows, fields) => {
            if (err) {
              res.send({ error: errors.SSE });
              console.log(err.message);
              return;
            }
            res.send({ username: req.query.username });
          }
        );
      }
    }
  );
});
router.patch("/update_dob", (req, res) => {
  mysqlConnection.query(
    querys.update.dob,
    [req.query.dob, req.query.userid],
    (err, rows, fields) => {
      console.log(req.originalUrl);
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send({ dob: req.query.dob });
    }
  );
});
router.patch("/update_bio", (req, res) => {
  mysqlConnection.query(
    querys.update.bio,
    [req.query.bio, req.query.userid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send({ bio: req.query.bio });
    }
  );
});
/*--------------------------------- */
/* ALL QUOTE HANDLERS */

router.get("/quotes", (req, res) => {
  mysqlConnection.query(
    req.query.userid ? querys.users_quotes : querys.all_quotes,
    req.query?.userid,
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send(rows);
    }
  );
});

router.post("/quote", (req, res) => {
  mysqlConnection.query(
    querys.post_quote,
    [req.query.userid, req.query.quote],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send("DONE");
    }
  );
});
router.delete("/quote", (req, res) => {
  mysqlConnection.query(
    querys.delete_quote,
    req.query.quoteid,
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send("DONE");
    }
  );
});

/*---------------------------*/
/*likes */
router.get("/likes", (req, res) => {
  mysqlConnection.query(
    querys.quotelikes,
    req.query.quoteid,
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      const result = { ...rows[0] };
      mysqlConnection.query(
        querys.likedby,
        [req.query.quoteid, req.query.userid],
        (err, rows, fields) => {
          if (err) {
            res.send({ error: errors.SSE });
            console.log(err.message);
            return;
          }
          if (rows.length === 1) {
            res.send({ ...result, likedbyme: true });
          } else {
            res.send({ ...result, likedbyme: false });
          }
        }
      );
    }
  );
});
router.post("/like", (req, res) => {
  mysqlConnection.query(
    querys.like,
    [req.query.userid, req.query.quoteid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send({ likedbyme: true });
    }
  );
});
router.delete("/like", (req, res) => {
  mysqlConnection.query(
    querys.dislike,
    [req.query.userid, req.query.quoteid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send({ likedbyme: false });
    }
  );
});

//friends
router.post("/follow", (req, res) => {
  mysqlConnection.query(
    querys.p_follow,
    [req.query.followerid, req.query.followingid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send("DONE");
    }
  );
});
router.get("/follow", (req, res) => {
  mysqlConnection.query(
    querys.g_follow,
    [req.query.followerid, req.query.followingid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      if (rows.length === 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});
router.get("/followers", (req, res) => {
  mysqlConnection.query(
    querys.followers,
    [req.query.userid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send(rows);
    }
  );
});
router.get("/followings", (req, res) => {
  mysqlConnection.query(
    querys.followings,
    [req.query.userid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send(rows);
    }
  );
});
router.delete("/removeFollow", (req, res) => {
  mysqlConnection.query(
    querys.removeFollow,
    [req.query.followerid, req.query.followingid],
    (err, rows, fields) => {
      if (err) {
        res.send({ error: errors.SSE });
        console.log(err.message);
        return;
      }
      res.send("DONE");
    }
  );
});

/* ------------------------ */
export default router;
