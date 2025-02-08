# 使用 nginx 镜像作为基础镜像
FROM registry.cn-beijing.aliyuncs.com/dkzx_test/nginx:1.24-alpine
# 将本地的 vue 前端静态资源文件复制到 Docker 容器中的 /usr/share/nginx/html 目录下
COPY ./server/public /usr/share/nginx/html
# 删除默认配置文件
RUN rm /etc/nginx/conf.d/default.conf
# 将自定义的 Nginx 配置文件复制到容器中的 /etc/nginx/conf.d 目录下，其中包含了与 Vue Router 配合使用的 URL 重写规则。
COPY nginx.conf /etc/nginx/conf.d/
# 暴露 80 端口
EXPOSE 80
# 运行 nginx
CMD ["nginx", "-g", "daemon off;"]