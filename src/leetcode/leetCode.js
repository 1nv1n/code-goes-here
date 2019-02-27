/** Contains methods related to LeetCode operations */

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
};
