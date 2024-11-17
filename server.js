const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        // Read the most recent message from the file
        fs.readFile('messages.txt', 'utf8', (err, data) => {
            let recentMessage = 'No messages yet!';
            if (!err && data.trim()) {
                recentMessage = data.trim(); // Get the latest message
            }

            // Display the form and the most recent message
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>Enter Message</title></head>');
            res.write('<body>');
            res.write('<h1>Message</h1>');
            res.write(`<h2>${recentMessage}</h2>`); // Display the recent message
            res.write(`
                <form action="/message" method="POST">
                    <input type="text" name="message" required>
                    <button type="submit">Send</button>
                </form>
            `);
            res.write('</body>');
            res.write('</html>');
            return res.end();
        });
    } else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk); // Accumulate data chunks
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1].replace(/\+/g, ' ').trim(); // Parse and clean the message

            // Overwrite the file with the new message
            fs.writeFile('messages.txt', decodeURIComponent(message), (err) => {
                if (err) {
                    console.error(err);
                }

                // Redirect back to the main page
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    } else {
        // Default response for other routes
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Node.js Project</title></head>');
        res.write('<body><h1>Welcome to my Node.js project</h1></body>');
        res.write('</html>');
        res.end();
    }
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/');
});
