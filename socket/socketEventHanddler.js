const child_process = require('child_process');
const fs = require('fs');

module.exports = function (socket) {
    socket.on('container', function(data) {
        const uid = data.uid;
        child_process.exec(`docker run -itd --name ${uid} node:6`, function (error, stdout, stderr) {
            socket.emit('container', {error, stdout, stderr});
        });
    });
    socket.on('cp', function(data) {
        const uid = data.uid;
        const codes = data.codes;
        const filenames = data.filenames;

        for(let i=0;i<filenames.length;i++) {
            fs.writeFileSync(`uploads/${filenames[i]}_${uid}`, codes[i]||'');
            child_process.execSync(`docker cp uploads/${filenames[i]}_${uid} ${uid}:${filenames[i]}`);
            child_process.exec(`rm uploads/${filenames[i]}_${uid}`);
        }
        socket.emit('cp', 'done');
    });
    socket.on('cmd', function(data) {
        const uid = data.uid;
        const cmd = data.cmd.split(' ');

        const run = child_process.spawn(`docker`,['exec',uid].concat(cmd))
        run.stdout.on('data', data=>socket.emit('cmd', data.toString()));
        run.stderr.on('data', data=>socket.emit('cmd', data.toString()));
    });
    socket.on('disconnect', function(){
        // 컨테이너 삭제 메서드
        console.log('user disconnected');
    });
}