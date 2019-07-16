/** Contains methods related to LeetCode operations */
import { Problem } from "./problem";

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
    const probList = [];

    stdList.split("\n").forEach((probRow) => {
      if (probRow.trim().length > 0) {
        const curProb = new Problem();

        const lastOpenSquareBracketIdx = probRow.lastIndexOf("[");
        const lastOpenRoundBracketIdx = probRow.lastIndexOf("(");
        const lastClosedSquareBracketIdx = probRow.lastIndexOf("]");
        const lastClosedRoundBracketIdx = probRow.lastIndexOf(")");

        curProb.probNum = probRow.substring(
          lastOpenSquareBracketIdx + 1,
          lastClosedSquareBracketIdx,
        ).trim();

        curProb.probAcc = probRow.substring(
          lastOpenRoundBracketIdx + 1,
          lastClosedRoundBracketIdx,
        ).trim();

        const probTitleWithDiff = probRow.substring(
          lastClosedSquareBracketIdx + 1,
          lastOpenRoundBracketIdx,
        ).trim();

        if (probTitleWithDiff.includes("Easy")) {
          curProb.probDiff = "Easy";
          curProb.probTitle = probTitleWithDiff.replace("Easy", "");
        } else if (probTitleWithDiff.includes("Medium")) {
          curProb.probDiff = "Medium";
          curProb.probTitle = probTitleWithDiff.replace("Medium", "");
        } else if (probTitleWithDiff.includes("Hard")) {
          curProb.probDiff = "Hard";
          curProb.probTitle = probTitleWithDiff.replace("Hard", "");
        } else {
          curProb.probDiff = "Undef.Diff";
        }
        curProb.probTitle = probTitleWithDiff.trim();

        probList.push(curProb);
      }
    });

    callback(probList);
  },
};
