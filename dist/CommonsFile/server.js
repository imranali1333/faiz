"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const cors_1 = require("./config/cors");
const sessionMiddleware_1 = __importDefault(require("./middleware/sessionMiddleware"));
const errorhandling_1 = require("../validations/Api/Telegram/errorhandling");
const routes_1 = __importDefault(require("../CommonsFile/routes/routes"));
const index_1 = __importDefault(require("../CommonsFile/socket/index"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.variables.env' });
const app = (0, express_1.default)();
app.use(cors_1.corsForAdmin);
app.use(cors_1.corsForUserFrontEnd);
app.use(sessionMiddleware_1.default);
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use(routes_1.default);
// Error handlers
app.use(errorhandling_1.errorHandler);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        result: null,
        message: 'Not Found',
    });
});
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            success: false,
            result: null,
            message: err.message,
        });
    });
}
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        result: null,
        message: 'Internal Server Error',
    });
});
const PORT = process.env.PORT || 8080;
const server = http_1.default.createServer(app);
(0, index_1.default)(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
