const express = require('express');
const path = require('path');
const app = express()

const createServer = function () {
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../replay.html'))
  })
  
  const server = app.listen(8888, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("启动本地服务 http://127.0.0.1:%s", port)
  })
}

module.exports = {
  createServer
}
