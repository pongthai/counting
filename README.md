# counting 



Dockerfile:
FROM jjanzic/docker-python3-opencv
RUN apt-get update -y
RUN apt-get install -y apache2
EXPOSE 80
CMD service apache2 start
CMD apachectl -D FOREGROUND

Docker:
docker run -d -p 80:80 -v $PWD/html:/var/www/html/ pongthai/opencv:1.0

