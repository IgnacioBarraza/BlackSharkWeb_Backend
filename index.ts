import app from './src/app'
import { PORT } from './src/utils/config'

app.listen(PORT, () => {
    console.log('Server up!')
    console.log(`http://localhost:${PORT}`)
})