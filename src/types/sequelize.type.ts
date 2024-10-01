import { Model,ModelStatic} from "sequelize";

export interface BaseModel extends Model {
    associate(models: Models): void; 
}
export type BaseModelStatic<T extends Model> = ModelStatic<T>

export type Models = Record<string, ModelStatic<Model> & { associate: (models: Models) => void }>