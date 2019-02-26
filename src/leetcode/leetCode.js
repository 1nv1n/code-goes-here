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
    const child = exec("leetcode user -l", (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      } else {
        console.log(stdout);
        console.log(stderr);
        child.stdin.end();
      }
    });

    child.stdout.on("data", (data) => {
      console.log(data.toString());
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
