/** Contains methods related to LeetCode operations */
import { LCProb } from "./lcProb";

module.exports = {
  leetCodeExec: function leetCodeExec(exec, command, callback) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(command);
        console.log(err);
      }
      callback(stdout, stderr);
    });
  },
  leetCodeLogin: function leetCodeLogin(exec, pref, callback) {
    const child = exec("leetcode user -l", (err) => {
      if (err) {
        console.log(err);
      } else {
        child.stdin.end();
      }
    });

    child.stdout.on("data", (data) => {
      if (data.includes("login:")) {
        child.stdin.write(`${pref.leetCodeUsername}\r\n`);
      } else if (data.includes("pass:")) {
        child.stdin.write(`${pref.leetCodePassword}\r\n`);
      } else if (data.includes("Successfully")) {
        callback(data);
      }
    });

    child.stdout.on("message", (data) => {
      console.log(data.toString());
    });
  },
  transformList: function transformList(stdList, callback) {
    let curProb;
    let probTitleWithDiff;

    const probList = [];
    const lcList = stdList.split("\n");

    lcList.forEach((probRow) => {
      if (probRow.trim().length > 0) {
        curProb = new LCProb();
        curProb.probNum = probRow.substring(
          probRow.lastIndexOf("[") + 1,
          probRow.lastIndexOf("]"),
        ).trim();

        curProb.probAcc = probRow.substring(
          probRow.lastIndexOf("(") + 1,
          probRow.lastIndexOf(")"),
        ).trim();

        probTitleWithDiff = probRow.substring(
          probRow.lastIndexOf("]") + 1,
          probRow.lastIndexOf("("),
        ).trim();

        if (probTitleWithDiff.includes("Easy")) {
          curProb.probDiff = "Easy";
          curProb.probTitle = probTitleWithDiff.replace("Easy", "").trim();
        } else if (probTitleWithDiff.includes("Medium")) {
          curProb.probDiff = "Medium";
          curProb.probTitle = probTitleWithDiff.replace("Medium", "").trim();
        } else if (probTitleWithDiff.includes("Hard")) {
          curProb.probDiff = "Hard";
          curProb.probTitle = probTitleWithDiff.replace("Hard", "").trim();
        } else {
          curProb.probDiff = "Undef.Diff";
          curProb.probTitle = probTitleWithDiff.trim();
        }

        probList.push(curProb);
      }
    });

    callback(probList);
  },
};
