FROM node:16.8.0
## WORKDIR specifies the directory our
## application's code will live within
WORKDIR /communication-service
## We copy our package.json file to our
## app directory
COPY package.json /communication-service
## We then run npm install to install
## express for our application
RUN npm install
## We then copy the rest of our application
## to the app direcoty
COPY . /communication-service
## We start our application by calling
## npm start.
CMD ["npm", "start"]

#Build docker image
#docker build -t <image-name> .

#Forcefully delete docker image
#docker rmi -f <image-id | image-name>

#Show all image
#docker image ls

#Show all running container
#docker ps

#Stop running container
#docker container stop <container-id | container-name>

#Run docker image in terminal
#docker run -it -p <host-port>:<guest-port> <image-id | image-name>



