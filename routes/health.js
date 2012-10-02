module.exports = health;

function health(req, res) {
  var info = {
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };

  res.end(JSON.stringify(info));
};
