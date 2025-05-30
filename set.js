const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUtjZGlzN3Z5RmhKTkNtOVVSRDhZLzUvUzBOOE9LU2dERlk2MDhicE9Fbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicCtMb1lLbEx0eitCdjNBRklYTzROZVNUUTdqU2RkVWZGVExMd0RnQnJ4MD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1QldhWURITUtXaXZ5bnlBVzFzS081MjN4RWpxNXp2bXI2T0MyRlVOSldrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOcWJqbGUvSml2WWJlak1yeUZzdTFVcTA0d1lxMEt2ZWtXeU0xako3YVhnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNGRE95RUxaNlBMQW0yY2VTeURqQUZCVGVYZm9Zd1NGOXdFYjRYSXdRbm89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJLeE9lTnI2dVdMeUhlOEt2NzZZM0oxQjg3MGxZVjVVK2h5OS9nTStKQlk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEZUdm4wS1ptYlpKQUV0WGhWdWFZSzE5WUo0dytINHlsWFRYTUN1RGUxbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0wvdmNKWCtTT2VYMVdWMlA4UjRCTXFOWlRURFNkVXFNcDRvK2ZkNTZSWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjlheVZTelRjcXNOZmhIbUtxcEN5aUFPdXo3M0JPakdmNlZyNTUvYTU0UEpkUGYvQlBSVVpvWmdEQStaVGZld1U1NlB3Mk5Dck9ndGlKcS93WXF5dmdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjIsImFkdlNlY3JldEtleSI6IlRnamlZbFZGYTRJRWIzSGhnREkrcFovdXNHUEZUS21sYmErVzdOOSt5SjQ9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IjEyM0xPVFVTIiwibWUiOnsiaWQiOiIyNTU3MTIyNTQyNjc6MzBAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiTVdMLiBNQUpFTlpJIiwibGlkIjoiMjM1NTc1MDEzNTYwNDc0OjMwQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDUFg2OTNZUXl1bmx3UVlZQWlBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVlFDUWtaZzlCcEJFU2U0Q1h4RzhSbmx1aXI5YmtpUFVVZk9LRWlLNGNBND0iLCJhY2NvdW50U2lnbmF0dXJlIjoiZzc1SCtWWjNiNVY3N25jSU1NR2JrcWFRSXdVcHNhNXJ1RnlxUEFiaGdYbU5JV3AwWjR1bi80STVmUk1TSVQ2bjY2TUNxcWoyci93SkJ3TXNBNVZRRFE9PSIsImRldmljZVNpZ25hdHVyZSI6IkhzcXE2UG5jSjZLalpZeFlFbmFiVTMraVdPUkRuTXVnWnNkaU04ZnQxS1p6SHlNakZyY3FHUWwzRFZHK2VYT2xzNmpRaGZic2xxR0hRYmFRTHB4cWhnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NzEyMjU0MjY3OjMwQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZVQWtKR1lQUWFRUkVudUFsOFJ2RVo1Ym9xL1c1SWoxRkh6aWhJaXVIQU8ifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0ODU5NTkyOSwibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUQzWiJ9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "MAJENZI",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255712254267",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'MAJENZI-XMD',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/533oqh.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '2' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.CHATBOT || 'yes',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    ANTIDELETE1 : process.env.ANTIDELETE1 || 'yes',
                  ANTIDELETE2 : process.env.ANTIDELETE2 || 'yes',
                  CHARLESKE_CHATBOT : process.env.CHARLESKE_CHATBOT || 'yes',
                  ANTICALL : process.env.ANTICALL || 'yes',
                  AUTO_REACT : process.env.AUTO_REACT || 'yes',
                  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
                  AUTO_REPLY : process.env.AUTO_REPLY || 'yes',
                  AUTO_READ : process.env.AUTO_READ || 'yes',
                  AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'yes',
                  AUTO_REJECT_CALL : process.env.AUTO_REJECT_CALL || 'yes',
                  AUTO_BIO : process.env.AUTO_BIO || 'yes',
                  AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',
                  AUTO_TAG_STATUS : process.env.AUTO_TAG_STATUS || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
