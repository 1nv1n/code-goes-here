/** Contains methods related to LeetCode operations */

module.exports = {
  lcExecute: function execute(exec, command, callback) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log("Command: $command. Error: $err");
      }
      callback(stdout, stderr);
    });
  },
};
