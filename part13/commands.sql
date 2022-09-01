CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);

INSERT INTO blogs (author, url, title) values ('Erkki Esimerkki', 'http://example.com', 'Erkin maanantaimietteet');
INSERT INTO blogs (author, url, title) values ('Erkki Esimerkki', 'http://example.com', 'Erkin tiistaituumat');