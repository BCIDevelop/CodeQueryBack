"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = require("bcryptjs");
const auth_1 = __importDefault(require("../config/auth"));
class UserModel extends sequelize_1.Model {
    static associate(models) {
        this.belongsToMany(models.classrooms, { through: 'student_classrooms' });
        this.belongsTo(models.roles, {
            foreignKey: 'rol_id',
            targetKey: 'id'
        });
        this.hasMany(models.classrooms, { foreignKey: 'owner_id' });
        this.hasMany(models.questions, { foreignKey: 'user_id' });
        this.hasMany(models.answers, { foreignKey: 'user_id' });
    }
    static initModel(sequelize) {
        return super.init({
            name: {
                type: sequelize_1.DataTypes.STRING,
            },
            last_name: {
                type: sequelize_1.DataTypes.STRING,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                unique: true
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
            },
            avatar: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            rol_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            active_status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false // false
            }
        }, {
            sequelize,
            tableName: 'users',
            modelName: 'users'
        });
    }
    hashPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            let passwordHash = (0, bcryptjs_1.hashSync)(this.password, (0, bcryptjs_1.genSaltSync)(auth_1.default.rounds));
            this.password = passwordHash;
        });
    }
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Password", this.password);
            return (0, bcryptjs_1.compareSync)(password, this.password);
        });
    }
}
exports.default = UserModel;
