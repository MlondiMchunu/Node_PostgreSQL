const app = require('./app')

const port = 3003;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})
//console.log(require.resolve('./app'))
//console.log(require('./app'))
//console.log(require.cache)



