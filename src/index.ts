import dotend from 'dotenv';
import app from './app';
import './database';

dotend.config();

function main() {
    const port = app.get('port');
    app.listen(port);
    console.log('Server on port', port);
}

main();
