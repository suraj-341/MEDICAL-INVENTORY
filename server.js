const express=require('express');
const mustacheExpress=require('mustache-express');
const { request, response } = require('express');



const app=express();
const mustache=mustacheExpress();
const bodyparser=require('body-parser');
const { Client }= require('pg');
mustache.cache=null;
app.engine('mustache',mustache);
app.set('view engine','mustache');


app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/add',(req,res)=>{
    res.render('med-form');
});


app.post('/meds/add',(req,res)=>{
    console.log('post body',req.body);
    
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            console.log('connection complete');
            const sql='INSERT INTO meds (name,count,brand) VALUES ($1, $2, $3)'
            const params=[req.body.name,req.body.count,req.body.brand];
            return client.query(sql,params);

        })
        .then((result)=>{
            console.log('results',result);
            res.redirect('/meds');
        }); 
});

app.get('/dashboard',(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            return client.query('SELECT SUM(count) FROM meds;SELECT DISTINCT COUNT(brand) FROM meds');
        })
        .then((results)=>{
            console.log('?results',results[0]);
            console.log('?results',results[1]);
            res.render('dashboard',{n1:results[0].rows,n2:results[1].rows});

        });

});
app.get('/meds',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            return client.query('SELECT * FROM meds');
        })
        .then((results)=>{
            //console.log('results?',results);
            res.render('meds',results);
        });

    
});

app.post('/meds/delete/:id', (req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            const sql='DELETE FROM MEDS WHERE mid= $1'
            const params=[req.params.id];
            return client.query(sql,params);
        })
        .then((results)=>{
            
            res.redirect('/meds');
        });


});
app.get('/meds/edit/:id',(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            const sql='SELECT * FROM meds WHERE mid=$1 '
            const params=[req.params.id];
            return client.query(sql,params);
        })
        .then((results)=>{
            //console.log("results?",results);
            res.render('meds-edit',{med:results.rows[0]}); 
        });


});
app.post('/meds/edit/:id',(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'medical',
        password:'1234',
        port:5432,

    });
    client.connect()
        .then(()=>{
            const sql='UPDATE meds SET name=$1,count=$2,brand=$3 WHERE mid=$4 '
            const params=[req.body.name ,req.body.count,req.body.brand,req.params.id];
            return client.query(sql,params);
        })
        .then((results)=>{
            
            res.redirect('/meds'); 
        });

})



app.listen(5001,()=>{
    console.log('Listning to port 5001');
})