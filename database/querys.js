const querys = {
  login: "SELECT * FROM users WHERE username=?",
  register:
    "INSERT INTO users(username,password,dob,email,bio) values(?,?,?,?,?)",
  checkReg: "SELECT username,email FROM users WHERE username=? OR email=?",

  user: "SELECT userid,username,dob,email,bio FROM users WHERE userid=?",
  search: "SELECT username FROM users WHERE username like ?",

  update: {
    username: "UPDATE users SET username=? WHERE userid=?",
    checkUN: "SELECT username FROM users WHERE username=?",
    dob: "UPDATE users SET dob=? WHERE userid=?",
    bio: "UPDATE users SET bio=? WHERE userid=?",
    email: "UPDATE users SET email=? WHERE userid=?",
  },

  all_quotes:
    "SELECT q.*, u.username FROM quotes AS q INNER JOIN users AS u WHERE (q.userid=u.userid)",
  users_quotes:
    " SELECT q.*, u.username FROM quotes AS q INNER JOIN users AS u WHERE (q.userid=u.userid) AND u.userid=?",
  post_quote: "INSERT INTO quotes(userid,quote) value(?,?)",
  delete_quote: "DELETE FROM quotes WHERE quoteid=?",

  quotelikes: "SELECT COUNT(likeid) AS quotelikes FROM likes WHERE quoteid=?",
  likedby: "SELECT likeid FROM likes WHERE quoteid=? AND userid=?",
  like: "INSERT INTO likes(userid,quoteid) values(?,?)",
  dislike: "DELETE FROM likes WHERE userid=? AND quoteid=?",

  p_follow: "INSERT INTO follows(followerid,followingid) values(?,?)",
  g_follow: "SELECT * FROM follows WHERE followerid=? AND followingid=?",
  followings:
    "SELECT f.followingid AS userid, u.username FROM follows AS f INNER JOIN users AS u WHERE (f.followingid=u.userid) AND followerid=?",
  followers:
    "SELECT f.followerid AS userid, u.username FROM follows AS f INNER JOIN users AS u WHERE (f.followerid=u.userid) AND followingid=?",
  removeFollow: "DELETE FROM follows WHERE followerid=? AND followingid=?",
};

export default querys;
