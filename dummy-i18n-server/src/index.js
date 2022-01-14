import fs from 'fs-extra';
import shortUUID from 'short-uuid';


const config = JSON.parse(fs.readFileSync('config.json'));


const distExists = fs.existsSync('dist');

if (distExists) {
    // fs.rmSync('dist', { recursive: true, force: true });
}
const deployID = shortUUID.generate();

const targetDistPath = `dist/${deployID}`;

fs.mkdirSync(targetDistPath, { recursive: true });


fs.copySync('src/locales/', targetDistPath);

fs.readdirSync(targetDistPath).forEach((dirName, index) => {
    const commonJSONPath = targetDistPath + '/' + dirName + '/' + config.common_json_name;
    if(fs.existsSync(commonJSONPath)) {
        const commonJSON = fs.readFileSync(commonJSONPath);
        const commonJSContent = `if (typeof window !== 'undefined') {
    window.commoni18n = ${commonJSON};
    window.commoni18nID = "${deployID}";
}`;

     fs.writeFileSync(targetDistPath + '/' + dirName + '/' + config.common_loader_js_name, commonJSContent);
     fs.writeFileSync('dist/metadata.json', JSON.stringify({last_deploy_id: deployID, last_update_date: new Date().getTime()}));
    } else {
        throw Error('ERROR: '+ dirName + " does not include " + config.common_json_name);
    }
})


