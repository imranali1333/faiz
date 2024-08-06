"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.variables.env') });
const admins = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'admins.json'), 'utf-8'));
async function loadData() {
    try {
        await prismaclient_1.default.admin.createMany({ data: admins });
        console.log('👍 Done!');
        process.exit();
    }
    catch (e) {
        console.log('\n🚫 Error →! The Error info is below but if you are importing sample data make sure to drop the existing database first.\n');
        console.error(e);
        process.exit();
    }
}
loadData();
