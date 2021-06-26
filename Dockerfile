FROM node:14.4.0-slim

# 指定用户、目录
USER root
RUN mkdir /home/node/app
WORKDIR /home/node/app

# COPY lock 仅安装生产依赖
COPY --chown=node:node . .
RUN yarn config set registry https://registry.npm.taobao.org/ && yarn install --production

# 运行
ENTRYPOINT ["node", "index"]