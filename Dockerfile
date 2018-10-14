FROM ruby:2.5.1
ADD . /src
WORKDIR /src

ENV LC_ALL=C.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8
RUN bundle install --jobs=3 --retry=3 --deployment --path=vendor/bundle
RUN bundle exec rake test

EXPOSE 9292

CMD [ "bundle", "exec", "puma", "-e", "development", "-b", "tcp://0.0.0.0:9292" ]
