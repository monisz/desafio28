const Knex = require('knex').default;
/* const { mysql } = require('../../config'); */


/* const { OPTIONS_MYSQL } = process.env; */
/* console.log(OPTIONS_MYSQL) */
const { faker } = require('@faker-js/faker');
faker.locale = "es";

/* console.log(process.env.OPTIONS_MYSQL) */
const knex = Knex({
    client: 'mysql',
    connection: /* process.env.OPTIONS_MYSQL */
        {
        host: process.env.OPTIONS_MYSQL_HOST,
        user: process.env.OPTIONS_MYSQL_USER,
        password: process.env.OPTIONS_MYSQL_PASSWORD,
        database: process.env.OPTIONS_MYSQL_DATABASE}
});
console.log("conectados a mysql");

class Container {
    constructor (table) {
        this.table = table;
    }    

    async save(element) {
        try {
            console.log("el que recibe en save", element)
            const res = await knex(this.table).insert(element);
            return res;
        }
        catch (error) {
            console.log("error en Save): ", error);
            return [];
        }
    }
    

    //Agregué este método para complementar el put por id
    async replaceById(idSearch, data) {
        try {
            const doc = await this.getById(idSearch);
            let newDoc = {...doc[0],...data}
            const result = await knex.from(this.table).where({id : idSearch}).update({
                title: newDoc.title,
                description: newDoc.description,
                code: newDoc.code,
                thumbnail: newDoc.thumbnail,
                price: newDoc.price,
                stock: newDoc.stock
            });
            return result;
        }
        catch (error) {
            console.log("error al reemplazar datos: ", error);
            return null;
        }
    }

    async getById(idSearch) {
        try {
            const doc = await knex.from(this.table).where({id : idSearch});
            return doc;
        }
        catch (error) {
            console.log("error al buscar por id: ", error);
        }
    }

    async getAll() {
        try {
            const products = await knex.from(this.table).select('*');
            return products;
        }
        catch (error) {
            console.log("error en getAll): ", error);
            return [];
        }
    }

    async deleteById(idSearch) {
        try {
            const result = await knex.from(this.table).where({id: idSearch}).del();
            return result;
        }
        catch (error) {
            console.log("error en deleteById): ", error);
        }
    }

    generateMock () {
        const mocks = [];
        let mock = {};
        for ( let i = 0; i < 5; i++) {
            mock = {
                title: faker.commerce.product(),
                price: faker.commerce.price(),
                thumbnail: faker.image.image()
            }
            mocks.push(mock);
        }
        return mocks;
    }
};

const tableProducts = new Container('products');

module.exports = tableProducts;

