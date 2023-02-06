const fs = require('fs');
const pth = require('path');

const dir1 = "D:\games";
const dir2 = "E:\programs";

const { readdir } = require('fs').promises;

const getFileList = async (dirName) => {
    const files = await readdir(dirName);

    return files;
};



getFileList(dir1).then((files) => {
    files.forEach((item) => {
        if (!fs.existsSync(`${dir2}/${item}`)) {
            const rstream = fs.createReadStream(`${dir1}/${item}`);
            const wstream = fs.createWriteStream(`${dir2}/${item}`);
            rstream.pipe(wstream);
        }
    })


});

getFileList(dir2).then((files) => {
    files.forEach((item) => {
        if (!fs.existsSync(`${dir1}/${item}`)) {
            const rstream = fs.createReadStream(`${dir2}/${item}`);
            const wstream = fs.createWriteStream(`${dir1}/${item}`);

            rstream.pipe(wstream);
        }

    })
});

getFileList(dir1).then((files) => {
    files.forEach((item, index) => {
        fs.readFile(`${dir1}/${item}`, (err, data1) => {
            if (err) throw err;
            fs.readFile(`${dir2}/${item}`, (err, data2) => {
                if (!data1.equals(data2)) {
                    const rstream = fs.createReadStream(`${dir1}/${item}`);
                    const wstream = fs.createWriteStream(`${dir2}/${item}`);
                    rstream.pipe(wstream);
                }
            })
        })
    })
})


const chokidar = require('chokidar');

const watcher = chokidar.watch(dir1, {
    persistent: false
})

chokidar.watch(dir1).on('all', (event, path) => {

    if (event === 'add') {
        fs.createReadStream(`${dir1}/${pth.basename(path)}`).pipe(fs.createWriteStream(`${dir2}/${pth.basename(path)}`));
    }
    if (event === 'unlink') {
        fs.unlink(`${dir2}/${pth.basename(path)}`, (err) => {
            if (err) throw err;
            console.log(`${pth.basename(path)} deleted`);
        });
    }
    if (event === 'change') {
        console.log("updated");
        let data = fs.readFileSync(`${dir1}/${pth.basename(path)}`, 'utf8');
        data = JSON.stringify(data);
        fs.writeFileSync(`${dir2}/${pth.basename(path)}`, JSON.parse(data), 'utf8');
    }
});

