const fs = require('fs-extra');
let mix = require('laravel-mix');

const projectDir = '/usr/local/share/p57b/php/idbfrontend/';
const assetsDirs = [
    '/usr/local/share/p57b/php/people/web/assets',
    '/usr/local/share/p57b/php/business/web/assets'
];
const jsBusinessDir = './src/business/js';
const sassBusinessDir = './src/business/sass';
const jsPeopleDir = './src/people/js';
const sassPeopleDir = './src/people/sass';
const jsIdbyiiDir = './src/idbyii2/js';
const sassIdbyiiDir = './src/idbyii2/sass';

function fromDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        return;
    }

    let filenames = [];

    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            filenames = filenames.concat(fromDir(filename, filter));
        } else if (filename.indexOf(filter) >= 0) {
            let tmp = path.parse(filename);

            if (tmp.name[0] !== '_') {
                filenames.push(filename);
            }
        }
    }

    return filenames;
}

mix.webpackConfig({
    resolve: {
        alias: {
            '@sharedJs': path.resolve('./src/shared/js'),
            '@sharedSass': path.resolve('./src/shared/js'),
            '@businessJs': path.resolve('./src/business/js'),
            '@businessSass': path.resolve('./src/business/sass'),
            '@idbyii2Js': path.resolve('./src/idbyii2/js'),
            '@idbyii2Sass': path.resolve('./src/idbyii2/sass'),
            '@peopleJs': path.resolve('./src/people/js'),
            '@peopleSass': path.resolve('./src/people/sass'),
        }
    }
});

let sassFiles = fromDir(sassBusinessDir, '.scss');

if (sassFiles === undefined) {
    sassFiles = [];
}

sassFiles = sassFiles.concat(fromDir(sassPeopleDir, '.scss'));

let jsFiles = fromDir(path.join(jsBusinessDir, 'idb/'), '.js');

if (jsFiles === undefined) {
    jsFiles = [];
}

jsFiles = jsFiles.concat(fromDir(path.join(jsBusinessDir, 'adminlte/'), '.js'));
jsFiles = jsFiles.concat(fromDir(path.join(jsPeopleDir, 'idb/'), '.js'));
jsFiles = jsFiles.concat(fromDir(path.join(jsPeopleDir, 'metronic/'), '.js'));


for (let file of sassFiles) {
    if (file === undefined) continue;
    let parsedPath = path.parse(file);
    let dirPath = parsedPath.dir.replace(path.join(projectDir, 'frontend') + '/', '');
    let distPath = dirPath.replace('src', 'dist') + '/';
    distPath.replace('sass', 'css');
    mix.sass(path.join(dirPath, parsedPath.base), distPath);
}

for (let file of jsFiles) {
    if (file === undefined) continue;
    let parsedPath = path.parse(file);
    let dirPath = parsedPath.dir.replace(path.join(projectDir, 'frontend') + '/', '');
    let distPath = dirPath.replace('src', 'dist') + '/';

    mix.js(path.join(dirPath, parsedPath.base), distPath);
}


let sassWidgetFiles = fromDir(sassIdbyiiDir, '.scss');
let jsWidgetFiles = fromDir(jsIdbyiiDir, '.js');

if (jsWidgetFiles === undefined) {
    jsWidgetFiles = [];
}

if (sassWidgetFiles === undefined) {
    sassWidgetFiles = [];
}

for (let file of sassWidgetFiles) {
    let parsedPath = path.parse(file);
    let dirPath = parsedPath.dir.replace(path.join(projectDir, 'frontend') + '/', '');
    let distPath = dirPath.replace('src', 'dist') + '/';
    distPath = distPath.replace('sass/', '');

    mix.sass(path.join(dirPath, parsedPath.base), distPath);
}

for (let file of jsWidgetFiles) {
    let parsedPath = path.parse(file);
    let dirPath = parsedPath.dir.replace(path.join(projectDir, 'frontend') + '/', '');
    let distPath = dirPath.replace('src', 'dist');
    distPath = distPath.replace('js/', '');

    mix.js(path.join(dirPath, parsedPath.base), distPath);
}

if(!mix.inProduction()) {
    mix.then(() => {
        for (let assetsDir of assetsDirs) {
            fs.readdir(assetsDir, (err, files) => {
                for (let file of files) {
                    if (file === '.gitignore') continue;

                    fs.remove(path.join(assetsDir, file)).catch(err => {
                        console.log(err);
                    })
                }
            });
        }
    });
}
