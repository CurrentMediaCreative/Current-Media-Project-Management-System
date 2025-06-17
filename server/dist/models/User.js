"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
exports.UserModel = {
    async authenticate(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        if (!user || !user.password)
            return null;
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return null;
        // We know the user and password exist at this point
        return user;
    },
    async findById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        // Only return if we have all required fields
        if (!user || !user.password)
            return null;
        return user;
    },
    async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
    }
};
//# sourceMappingURL=User.js.map