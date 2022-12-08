import express from 'express';
import { renderFile } from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const app = express();
const PORT = 3232;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());

app.get('/', (req, res) => {
    console.log('WEB INDEX');

    res.status(200).render('index.html');
});


app.listen(PORT, () => {
    console.log(`WEB SERVER ON ${PORT}`);

    fetch('http://host.docker.internal/main/').then(async(res) => {
        // const { message } = await res.json();
        const message = await res.text();

        console.log(message);
    });

    fetch('http://host.docker.internal/sub/').then(async(res) => {
        // const { message } = await res.json();
        const message = await res.text();

        console.log(message);
    });
});