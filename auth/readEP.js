import fs from "fs";

let data;
try {
  // ep.txt format-> email,password
  const raw = fs.readFileSync("ep.txt", "utf8");
  data = raw.split(",");
} catch (err) {
  console.log(err);
}
export default {
  email: data[0],
  pass: data[1],
};
