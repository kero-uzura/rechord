source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '2.6.5'

# Core
gem 'rails', '~> 5.2.2.1'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 4.3'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'webpacker', '~> 3.5.5'
gem 'therubyracer', platforms: :ruby
gem 'jbuilder', '~> 2.5'
# gem 'capistrano-rails', group: :development
gem 'bootsnap', '>= 1.1.0', require: false
gem 'unicorn'
gem 'dotenv-rails'

# Layout
gem 'font-awesome-rails'
gem 'rails-i18n'
gem 'slim-rails'
gem 'bulma-rails'

# API
gem 'friendly_id'
gem 'ransack'
gem 'kaminari'

# Authentication
gem 'devise'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
gem 'omniauth-tumblr'
gem 'omniauth-github'

# Management
gem 'cancancan'
gem 'rails_admin', github: 'sferik/rails_admin', ref: '0939adf49c708fccf730023ac8cf0fdff34f9917'
gem 'rails_admin-i18n'
gem 'newrelic_rpm'

# Upload
gem 'carrierwave'
gem 'fog'
gem 'rmagick'

# Counter
gem 'impressionist'
gem 'counter_culture', '~> 1.8'

# Session
gem 'redis'
gem 'redis-rails'

# Backup
gem 'dropbox_api'
gem 'whenever', require: false

# Notification
gem 'exception_notification'
gem 'slack-notifier'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
  gem 'pry-rails'
  gem 'pry-byebug'
  gem 'pry-doc'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'bcrypt', '~> 3.1.7'
  gem 'bcrypt_pbkdf'
  gem 'ed25519'

  # gem 'capistrano',         require: false
  # gem 'capistrano-rails',   require: false
  # gem 'capistrano-bundler', require: false
  # gem 'capistrano3-puma',   require: false
  # gem 'capistrano-rbenv',   require: false
end
