create table bib (id serial primary key, url text,title text,vol text,series text,version text,author text,publisher text,year text,isbn text,format text,public text);
create table photo (id serial primary key, pid text, photo_url text, timestamp timestamp default current_timestamp);
