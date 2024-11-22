import models from '../src/models'
import {hashSync,genSaltSync} from 'bcryptjs'
import auth from "../src/config/auth"
const {users,roles,tags,sequelize} = models

const rolesSeed = [
    { id:1,name: 'Student' },
    { id:2,name: 'Teacher' },
  ];
  let passwordHash=hashSync('Admin123',genSaltSync(auth.rounds))
  const usersSeed = [
    { id:1,password: passwordHash, rol_id: 2 , email:"admin@gmail.com",last_name:"admin",active_status:true,name:"admin"}
    
  ];

  const tagsSeed = [
    { id:1,name: 'HTML' },
    { id:2,name: 'CSS' },
    { id:3,name: 'JS' },
    { id:4,name: 'REACT' },
    { id:5,name: 'POSTGRES' },
    { id:6,name: 'NODEJS' },
    { id:7,name: 'CODING' },
    { id:8,name: 'PYTHON' },
    { id:9,name: 'TYPESCRIPT' },
    { id:10,name: 'MONGODB' },
  ];
  async function seedDatabase() {
    const transaction = await sequelize.transaction();
    try {
      await roles.bulkCreate(rolesSeed, { transaction });
      await users.bulkCreate(usersSeed, { transaction });
      await tags.bulkCreate(tagsSeed, { transaction });
      await transaction.commit();
  
      console.log('Datos poblados con éxito');
    } catch (error) {
      console.error('Error al poblar la base de datos: ', error);
      if (transaction) await transaction.rollback();
      throw Error("Hubo un error en la transaccion")
    } finally {
      // Cerrar la conexión a la base de datos
      await sequelize.close();
      console.log('Conexión a la base de datos cerrada.');
    }
  }
  
  seedDatabase()
    .then(() => {
      console.log('Seeding completo.');
      process.exit();  // Cierra el proceso de Node.js
    })
    .catch((err) => {
      console.error('Seeding fallido:', err);
      process.exit(1);  // Cierra el proceso de Node.js con error
    });