FROM ruby:3.2.1
ADD . /src
WORKDIR /src

ENV LC_ALL=C.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8
RUN bundle config set --global deployment true && \
    bundle config set --global path vendor/bundle && \
    bundle config set --global jobs 3 && \
    bundle install
RUN bundle exec rake test

EXPOSE 9292

CMD [ "bundle", "exec", "puma", "-e", "development", "-b", "tcp://0.0.0.0:9292" ]
