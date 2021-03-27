const Sequelize = require('sequelize');
const sequelize = new Sequelize('produtos','postgres','0000',{
    host:'localhost',
    dialect:'postgres'
});
const redis = require("redis");
const client = redis.createClient();



//testa a conexação
/*
sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso")
}).catch(function(erro){
     console.log("ERRO:"+erro)
});
*/

const produtos = sequelize.define('Produtos',{
    chave:{
        type: Sequelize.STRING
    },
    produto:{
        type: Sequelize.STRING
    }
})
//produtos.sync({force:true})

/*********************************************************************/


//MOSTRAR TODOS OS REGISTROS:
var mostrarTudo = async function (){
    const valor = await produtos.findAll({
            raw : true
    })

    return valor;
}


//////////////////////////////


//MOSTRAR UM REGISTRO ESPECIFICO
async function mostrar(chave){
    const valor = await produtos.findAll({
            attributes: ['chave', 'produto'],
            where: {
                chave: chave
            },
            raw : true
        })

        return valor[0]['produto']
}
/*
mostrar('messa').then(dados=>{
    console.log(dados)
})
*/
//////////////////////////////



//CRIA REGISTROS
function criar(chave,produto){
    produtos.create({
        chave:chave,
        produto:produto
    })
}

//////////////////////////////



//APAGA UM REGISTRO
function apagar(id){
   produtos.destroy({
    where: {
      id: id
    }
  })
}


//////////////////////////////


//1° MOSTRAR TODOS OS REGISTROS:
//mostrarTudo().then(dados=>{
//    console.log(dados)
//})


//client.get("2", redis.print);

//criar("2","lápis")

buscaRedis("2");


//client.get("2", redis.print);

//Se o produto estiver no PostgreSQL ele será retornado, além disso, os dados do produto devem ser persistidos no cache (Redis), com TTL de 60 minutos.
function buscaRedis(chave){

    client.get(chave, function(err, reply) {
        // reply is null when the key is missing
        if (reply == null){
            produtos.findAll({
                attributes: ['chave', 'produto'],
                where: {
                    chave: chave
                },
                raw : true
            }).then(function(valor){
                client.set(valor[0]['chave'], valor[0]['produto']);
            })
        }else{
            client.get(chave, redis.print);
        }
    })
    }






















































