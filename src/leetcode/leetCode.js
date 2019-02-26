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
  leetCodeSpawn: function leetCodeSpawn(spawn, command, pref, callback) {
    const child = spawn(command);
    // child.stdin.setEncoding("utf-8");
    // process.stdin.pipe(child.stdin);
    // child.stdout.pipe(process.stdout);
    child.stdin.write(pref.leetCodeUsername + " \r\n" + pref.leetCodePassword + " \r\n");
    child.stdin.end();
    console.log(child.stdout);
  },
};
